import cv2
import numpy as np
import os
import pickle
import time
from pathlib import Path
from sklearn.preprocessing import LabelEncoder

# Correct MediaPipe imports for version 0.10+
from mediapipe.python.solutions import hands as mp_hands

# -------------------------------
# Start time
# -------------------------------
start_time = time.time()

# -------------------------------
# Project paths
# -------------------------------
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR.parent / "dataset" / "Indian"
MODEL_DIR = BASE_DIR / "model"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
FEATURES_PATH = MODEL_DIR / "karan.pickle"
ENCODER_PATH = MODEL_DIR / "karan.pkl"

X = []
y = []

# -------------------------------
# Initialize MediaPipe Hands
# -------------------------------
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.5
)

# -------------------------------
# Normalize landmarks
# -------------------------------
def normalize_landmarks(landmarks):
    landmarks = np.array(landmarks).reshape(-1, 2)
    base = landmarks[0]
    centered = landmarks - base
    max_value = np.max(np.linalg.norm(centered, axis=1))
    if max_value != 0:
        centered = centered / max_value
    return centered.flatten().tolist()

# -------------------------------
# Extract hand landmarks
# -------------------------------
def extract_landmarks(image):
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)

    if results.multi_hand_landmarks:
        if len(results.multi_hand_landmarks) == 2:
            lm1 = [[lm.x, lm.y] for lm in results.multi_hand_landmarks[0].landmark]
            lm2 = [[lm.x, lm.y] for lm in results.multi_hand_landmarks[1].landmark]
        else:
            lm1 = [[lm.x, lm.y] for lm in results.multi_hand_landmarks[0].landmark]
            lm2 = [[0, 0]] * 21

        combined = lm1 + lm2  # 42 landmarks
        return normalize_landmarks(combined)

    return None

# -------------------------------
# Image augmentation
# -------------------------------
def augment_image(image):
    aug_images = []

    # Flip
    aug_images.append(cv2.flip(image, 1))

    # Rotations
    h, w = image.shape[:2]
    for angle in [-10, 10]:
        M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, 1)
        aug_images.append(cv2.warpAffine(image, M, (w, h)))

    # Scaling
    for scale in [0.9, 1.1]:
        new_w, new_h = int(w * scale), int(h * scale)
        resized = cv2.resize(image, (new_w, new_h))

        if scale < 1.0:
            pad_x = (w - new_w) // 2
            pad_y = (h - new_h) // 2
            padded = cv2.copyMakeBorder(
                resized,
                pad_y, h - new_h - pad_y,
                pad_x, w - new_w - pad_x,
                cv2.BORDER_CONSTANT,
                value=0
            )
            aug_images.append(padded)
        else:
            start_x = (new_w - w) // 2
            start_y = (new_h - h) // 2
            cropped = resized[start_y:start_y + h, start_x:start_x + w]
            aug_images.append(cropped)

    # Brightness
    for factor in [0.6, 1.4]:
        aug_images.append(cv2.convertScaleAbs(image, alpha=factor, beta=10))

    # Contrast
    for contrast in [0.8, 1.5]:
        aug_images.append(cv2.convertScaleAbs(image, alpha=contrast, beta=0))

    return aug_images

# -------------------------------
# Load data and preprocess
# -------------------------------
print("🔄 Starting preprocessing...")

for label in os.listdir(DATA_DIR):
    class_dir = os.path.join(DATA_DIR, label)
    if not os.path.isdir(class_dir):
        continue

    print(f"📁 Processing class: {label}")

    for img_name in os.listdir(class_dir):
        img_path = os.path.join(class_dir, img_name)
        img = cv2.imread(img_path)

        if img is None:
            continue

        # Original
        result = extract_landmarks(img)
        if result:
            X.append(result)
            y.append(label)

        # Augmented
        for aug_img in augment_image(img):
            result = extract_landmarks(aug_img)
            if result:
                X.append(result)
                y.append(label)

hands.close()

# -------------------------------
# Encode labels
# -------------------------------
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# -------------------------------
# Final shaping
# -------------------------------
X = np.array(X, dtype=np.float32).reshape(-1, 42, 2, 1)

# -------------------------------
# Save processed data
# -------------------------------
with open(FEATURES_PATH, "wb") as f:
    pickle.dump((X, y_encoded), f)

with open(ENCODER_PATH, "wb") as f:
    pickle.dump(le, f)

# -------------------------------
# End time
# -------------------------------
end_time = time.time()
total_time = end_time - start_time

print("\n✅ Preprocessing complete")
print(f"📊 Total samples: {len(X)}")
print(f"⏱️ Time taken: {total_time:.2f} seconds ({total_time/60:.2f} minutes)")
print(f"💾 Files saved: {FEATURES_PATH.name}, {ENCODER_PATH.name}")
