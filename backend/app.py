import base64
import logging
import numpy as np
import pickle
import cv2
import tensorflow as tf

from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool

# ---------------------
# Logging Configuration
# ---------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ishara-api")

# ---------------------
# MediaPipe Import
# ---------------------
try:
    import mediapipe as mp
    mp_hands = mp.solutions.hands
except (AttributeError, ModuleNotFoundError):
    from mediapipe.python.solutions import hands as mp_hands

# ---------------------
# Paths
# ---------------------
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "karan.h5"
ENCODER_PATH = BASE_DIR / "model" / "karan.pkl"

# ---------------------
# Validate Files
# ---------------------
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

if not ENCODER_PATH.exists():
    raise FileNotFoundError(f"Encoder file not found: {ENCODER_PATH}")

# ---------------------
# Load Model
# ---------------------
logger.info("Loading TensorFlow model...")
model = tf.keras.models.load_model(MODEL_PATH)

logger.info("Loading label encoder...")
with open(ENCODER_PATH, "rb") as f:
    label_encoder = pickle.load(f)

logger.info("Model and encoder loaded successfully")

# ---------------------
# Initialize MediaPipe once
# ---------------------
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6,
)

# ---------------------
# Landmark helpers
# ---------------------
def normalize_landmarks(landmarks):
    landmarks = np.array(landmarks).reshape(-1, 2)

    base = landmarks[0]
    centered = landmarks - base

    max_value = np.max(np.linalg.norm(centered, axis=1))

    if max_value != 0:
        centered = centered / max_value

    return centered.flatten()


def extract_landmarks(results):

    if results.multi_hand_landmarks:

        if len(results.multi_hand_landmarks) == 2:

            hand1 = [[lm.x, lm.y] for lm in results.multi_hand_landmarks[0].landmark]
            hand2 = [[lm.x, lm.y] for lm in results.multi_hand_landmarks[1].landmark]

        else:

            hand1 = [[lm.x, lm.y] for lm in results.multi_hand_landmarks[0].landmark]
            hand2 = [[0, 0]] * 21

        combined = hand1 + hand2
        return normalize_landmarks(combined)

    return None


# ---------------------
# FastAPI App
# ---------------------
app = FastAPI(
    title="Ishara Sign Language Detection API",
    description="Real-time Indian Sign Language recognition using MediaPipe and TensorFlow",
    version="1.0.0",
)

# ---------------------
# CORS
# ---------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------
# Health Endpoint
# ---------------------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
    }


# ---------------------
# WebSocket Endpoint
# ---------------------
@app.websocket("/ws/detect")
async def detect(websocket: WebSocket):

    await websocket.accept()
    logger.info("WebSocket client connected")

    try:

        while True:

            data = await websocket.receive_text()

            # Remove data-url prefix
            if "," in data:
                data = data.split(",", 1)[1]

            try:

                img_bytes = base64.b64decode(data)
                np_arr = np.frombuffer(img_bytes, dtype=np.uint8)
                frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            except Exception as e:

                logger.error(f"Image decoding error: {e}")

                await websocket.send_json({
                    "hand_detected": False,
                    "label": None,
                    "confidence": 0
                })

                continue

            if frame is None:

                await websocket.send_json({
                    "hand_detected": False,
                    "label": None,
                    "confidence": 0
                })

                continue

            frame = cv2.flip(frame, 1)

            img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            results = hands.process(img_rgb)

            landmarks = extract_landmarks(results)

            if landmarks is None:

                await websocket.send_json({
                    "hand_detected": False,
                    "label": None,
                    "confidence": 0
                })

                continue

            X = np.array(landmarks, dtype=np.float32).reshape(1, 42, 2, 1)

            try:

                prediction = await run_in_threadpool(model.predict, X)

            except Exception as e:

                logger.error(f"Prediction error: {e}")

                await websocket.send_json({
                    "hand_detected": False,
                    "label": None,
                    "confidence": 0
                })

                continue

            class_id = int(np.argmax(prediction))

            label = label_encoder.inverse_transform([class_id])[0]

            confidence = float(np.max(prediction) * 100)

            await websocket.send_json({
                "hand_detected": True,
                "label": str(label),
                "confidence": round(confidence, 1),
            })

    except WebSocketDisconnect:

        logger.info("WebSocket client disconnected")

    except Exception as e:

        logger.error(f"Unexpected error: {e}")

    finally:

        logger.info("WebSocket session closed")