import base64
import logging
import numpy as np
import pickle
import cv2
import tensorflow as tf
import random

from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
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
    mp_holistic = mp.solutions.holistic
except (AttributeError, ModuleNotFoundError):
    from mediapipe.python.solutions import hands as mp_hands
    from mediapipe.python.solutions import holistic as mp_holistic

# ---------------------
# Paths
# ---------------------
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "karan.h5"
ENCODER_PATH = BASE_DIR / "model" / "karan.pkl"
LSTM_MODEL_PATH = BASE_DIR / "model" / "lstm_model.h5"

# ---------------------
# LSTM config
# ---------------------
LSTM_ACTIONS = np.array(['hello', 'thanks', 'iloveyou'])
LSTM_SEQUENCE_LENGTH = 30
LSTM_THRESHOLD = 0.6

# ---------------------
# Validate Files
# ---------------------
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

if not ENCODER_PATH.exists():
    raise FileNotFoundError(f"Encoder file not found: {ENCODER_PATH}")

# ---------------------
# Load CNN Model (letters/numbers)
# ---------------------
logger.info("Loading CNN model...")
cnn_model = tf.keras.models.load_model(MODEL_PATH)

logger.info("Loading label encoder...")
with open(ENCODER_PATH, "rb") as f:
    label_encoder = pickle.load(f)

# ---------------------
# Load LSTM Model (gestures)
# ---------------------
lstm_model = None
if LSTM_MODEL_PATH.exists():
    logger.info("Loading LSTM model...")
    lstm_model = tf.keras.models.load_model(LSTM_MODEL_PATH)
    logger.info("LSTM model loaded successfully")
else:
    logger.warning(f"LSTM model not found at {LSTM_MODEL_PATH}, gesture detection disabled")

logger.info("Models loaded successfully")

# ---------------------
# Initialize MediaPipe
# ---------------------
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6,
)

# ---------------------
# CNN Landmark helpers
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
# LSTM Landmark helpers
# ---------------------
def extract_holistic_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
    return np.concatenate([pose, lh, rh])  # 258 features


# ---------------------
# FastAPI App
# ---------------------
app = FastAPI(
    title="Ishara Sign Language Detection API",
    description="Real-time Indian Sign Language recognition using MediaPipe and TensorFlow",
    version="2.0.0",
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
        "cnn_model_loaded": cnn_model is not None,
        "lstm_model_loaded": lstm_model is not None,
        "modes": ["letter", "gesture"] if lstm_model else ["letter"],
    }


# ---------------------
# Sign Image Endpoints
# ---------------------
DATASET_PATH = BASE_DIR.parent / "dataset" / "Indian"
VALID_SIGNS = set()
if DATASET_PATH.exists():
    VALID_SIGNS = {d.name for d in DATASET_PATH.iterdir() if d.is_dir()}
    logger.info(f"Sign dataset loaded: {sorted(VALID_SIGNS)}")


@app.get("/api/signs/available")
def available_signs():
    return {"signs": sorted(VALID_SIGNS)}


@app.get("/api/signs/{character}")
def get_sign_image(character: str):
    char = character.upper()
    if char not in VALID_SIGNS:
        return JSONResponse(status_code=404, content={"error": f"Sign '{char}' not found"})

    sign_dir = DATASET_PATH / char
    images = [f for f in sign_dir.iterdir() if f.suffix.lower() in (".jpg", ".png", ".jpeg")]
    if not images:
        return JSONResponse(status_code=404, content={"error": f"No images for '{char}'"})

    chosen = random.choice(images)
    return FileResponse(chosen, media_type="image/jpeg")


# ---------------------
# WebSocket Endpoint
# ---------------------
# ---------------------
# Helper: decode frame from base64
# ---------------------
def decode_frame(data: str):
    if "," in data:
        data = data.split(",", 1)[1]
    img_bytes = base64.b64decode(data)
    np_arr = np.frombuffer(img_bytes, dtype=np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return frame


NO_DETECTION = {"hand_detected": False, "label": None, "confidence": 0}


# ---------------------
# WebSocket: Letter Detection (CNN)
# ---------------------
@app.websocket("/ws/detect")
async def detect(websocket: WebSocket):
    await websocket.accept()
    logger.info("CNN WebSocket client connected")

    try:
        while True:
            data = await websocket.receive_text()

            try:
                frame = decode_frame(data)
            except Exception as e:
                logger.error(f"Image decoding error: {e}")
                await websocket.send_json(NO_DETECTION)
                continue

            if frame is None:
                await websocket.send_json(NO_DETECTION)
                continue

            frame = cv2.flip(frame, 1)
            img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(img_rgb)
            landmarks = extract_landmarks(results)

            if landmarks is None:
                await websocket.send_json(NO_DETECTION)
                continue

            X = np.array(landmarks, dtype=np.float32).reshape(1, 42, 2, 1)

            try:
                prediction = await run_in_threadpool(cnn_model.predict, X)
            except Exception as e:
                logger.error(f"CNN prediction error: {e}")
                await websocket.send_json(NO_DETECTION)
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
        logger.info("CNN WebSocket client disconnected")
    except Exception as e:
        logger.error(f"CNN unexpected error: {e}")
    finally:
        logger.info("CNN WebSocket session closed")


# ---------------------
# WebSocket: Gesture Detection (LSTM)
# ---------------------
@app.websocket("/ws/detect-gesture")
async def detect_gesture(websocket: WebSocket):
    await websocket.accept()
    logger.info("LSTM WebSocket client connected")

    if lstm_model is None:
        await websocket.send_json({"error": "LSTM model not loaded"})
        await websocket.close()
        return

    sequence = []  # rolling buffer of keypoint frames

    holistic = mp_holistic.Holistic(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    try:
        while True:
            data = await websocket.receive_text()

            try:
                frame = decode_frame(data)
            except Exception as e:
                logger.error(f"Image decoding error: {e}")
                await websocket.send_json(NO_DETECTION)
                continue

            if frame is None:
                await websocket.send_json(NO_DETECTION)
                continue

            frame = cv2.flip(frame, 1)
            img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = holistic.process(img_rgb)

            keypoints = extract_holistic_keypoints(results)
            sequence.append(keypoints)
            sequence = sequence[-LSTM_SEQUENCE_LENGTH:]

            # Need full sequence before predicting
            if len(sequence) < LSTM_SEQUENCE_LENGTH:
                await websocket.send_json({
                    "hand_detected": True,
                    "label": None,
                    "confidence": 0,
                    "buffering": len(sequence),
                    "buffer_needed": LSTM_SEQUENCE_LENGTH,
                })
                continue

            X = np.expand_dims(sequence, axis=0).astype(np.float32)

            try:
                prediction = await run_in_threadpool(lstm_model.predict, X)
            except Exception as e:
                logger.error(f"LSTM prediction error: {e}")
                await websocket.send_json(NO_DETECTION)
                continue

            res = prediction[0]
            class_id = int(np.argmax(res))
            confidence = float(np.max(res) * 100)

            if confidence / 100 >= LSTM_THRESHOLD:
                label = str(LSTM_ACTIONS[class_id])
            else:
                label = None

            await websocket.send_json({
                "hand_detected": True,
                "label": label,
                "confidence": round(confidence, 1),
            })

    except WebSocketDisconnect:
        logger.info("LSTM WebSocket client disconnected")
    except Exception as e:
        logger.error(f"LSTM unexpected error: {e}")
    finally:
        holistic.close()
        logger.info("LSTM WebSocket session closed")