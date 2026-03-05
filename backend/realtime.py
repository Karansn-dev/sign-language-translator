import cv2
import numpy as np
import pickle
import tensorflow as tf
from pathlib import Path

# MediaPipe import (supports both standard and newer layouts)
try:
    import mediapipe as mp
    mp_hands = mp.solutions.hands
    mp_draw = mp.solutions.drawing_utils
except (AttributeError, ModuleNotFoundError):
    from mediapipe.python.solutions import hands as mp_hands
    from mediapipe.python.solutions import drawing_utils as mp_draw

# -----------------------------
# Paths (robust & portable)
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "karan.h5"
ENCODER_PATH = BASE_DIR / "model" / "karan.pkl"

# -----------------------------
# Load trained model & labels
# -----------------------------
model = tf.keras.models.load_model(MODEL_PATH)

with open(ENCODER_PATH, "rb") as f:
    label_encoder = pickle.load(f)

# -----------------------------
# MediaPipe Hands setup
# -----------------------------
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6
)

# -----------------------------
# Landmark normalization
# -----------------------------
def normalize_landmarks(landmarks):
    landmarks = np.array(landmarks).reshape(-1, 2)
    base = landmarks[0]  # wrist
    centered = landmarks - base
    max_value = np.max(np.linalg.norm(centered, axis=1))
    if max_value != 0:
        centered = centered / max_value
    return centered.flatten()

# -----------------------------
# Extract landmarks
# -----------------------------
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

# -----------------------------
# Webcam
# -----------------------------
cap = cv2.VideoCapture(0)
print("🎥 Webcam started (press 'q' to quit)")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)

    # 🔹 DRAW HAND LANDMARKS 🔹
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_draw.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_draw.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=3),
                mp_draw.DrawingSpec(color=(255, 0, 0), thickness=2)
            )

    # 🔹 PREDICTION 🔹
    landmarks = extract_landmarks(results)
    if landmarks is not None:
        X = np.array(landmarks, dtype=np.float32).reshape(1, 42, 2, 1)
        prediction = model.predict(X, verbose=0)
        class_id = np.argmax(prediction)
        label = label_encoder.inverse_transform([class_id])[0]
        confidence = np.max(prediction) * 100

        cv2.putText(
            frame,
            f"{label} ({confidence:.1f}%)",
            (30, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            (0, 255, 0),
            3
        )

    cv2.imshow("Ishara – Real-time ISL Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
hands.close()
