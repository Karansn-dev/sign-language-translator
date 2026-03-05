import pickle
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping
import tensorflow as tf

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
FEATURES_PATH = MODEL_DIR / "karan.pickle"
MODEL_PATH = MODEL_DIR / "karan.h5"

print("📦 Loading dataset...")

# -----------------------------
# Load data
# -----------------------------
with open(FEATURES_PATH, "rb") as f:
    X, y = pickle.load(f)

print("✅ Data loaded")

# -----------------------------
# Preprocess data
# -----------------------------
X = np.array(X, dtype=np.float32).reshape(-1, 42, 2, 1)
y = to_categorical(y)

print("X shape:", X.shape)
print("y shape:", y.shape)

# -----------------------------
# Train-test split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, shuffle=True
)

print("📊 Train size:", X_train.shape[0])
print("📊 Test size:", X_test.shape[0])

# -----------------------------
# Build CNN model
# -----------------------------
model = Sequential([
    Conv2D(64, (3, 2), activation='relu', input_shape=(42, 2, 1)),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 1)),

    Conv2D(128, (3, 1), activation='relu'),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 1)),

    Conv2D(256, (3, 1), activation='relu'),
    BatchNormalization(),

    Flatten(),
    Dense(256, activation='relu'),
    Dropout(0.4),

    Dense(y.shape[1], activation='softmax')
])

# -----------------------------
# Compile model
# -----------------------------
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# -----------------------------
# Early stopping
# -----------------------------
early_stop = EarlyStopping(
    monitor='val_accuracy',
    patience=5,
    restore_best_weights=True
)

# -----------------------------
# Train model
# -----------------------------
print("🚀 Starting training...")

history = model.fit(
    X_train,
    y_train,
    epochs=30,
    batch_size=256,
    validation_data=(X_test, y_test),
    callbacks=[early_stop]
)

# -----------------------------
# Evaluate model
# -----------------------------
test_loss, test_accuracy = model.evaluate(X_test, y_test)

print(f"\n🎯 Test Accuracy: {test_accuracy * 100:.2f}%")
print(f"📉 Test Loss: {test_loss:.4f}")

# -----------------------------
# Save model
# -----------------------------
model.save(MODEL_PATH)
print(f"\n✅ Model saved as '{MODEL_PATH.name}'")
