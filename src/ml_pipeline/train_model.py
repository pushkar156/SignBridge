import os
import numpy as np
import pandas as pd
import string
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(SCRIPT_DIR, "dataset.csv")
MODEL_SAVE_PATH = os.path.join(SCRIPT_DIR, "signbridge_model_v1.h5")

# 35 Classes
CLASSES = [str(i) for i in range(1, 10)] + list(string.ascii_uppercase)
CLASS_TO_IDX = {c: i for i, c in enumerate(CLASSES)}

def load_data():
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"{CSV_PATH} not found. Run generate_dataset.py first.")
        
    df = pd.read_csv(CSV_PATH)
    labels = df['label'].values
    features = df.drop('label', axis=1).values
    
    # Convert labels to indices
    y = np.array([CLASS_TO_IDX[label] for label in labels])
    X = features.astype(np.float32)
    return X, y

def augment_data(X, y, num_augments=3):
    """
    Apply slight random translations and noise to the landmarks to simulate 
    mobile camera jitter and different hand positions.
    """
    print(f"Applying data augmentation (x{num_augments})...")
    X_aug = [X]
    y_aug = [y]
    
    for _ in range(num_augments):
        # 1. Add random Gaussian noise (jitter)
        noise = np.random.normal(0, 0.02, X.shape).astype(np.float32)
        
        # 2. Add random scaling (0.9 to 1.1)
        scale = np.random.uniform(0.9, 1.1, (X.shape[0], 1)).astype(np.float32)
        
        # 3. Add random shift (translation)
        shift = np.random.uniform(-0.05, 0.05, X.shape).astype(np.float32)
        
        X_new = (X * scale) + shift + noise
        
        # Re-normalize just to be safe (max absolute value per row to 1.0)
        max_vals = np.max(np.abs(X_new), axis=1, keepdims=True)
        # Avoid division by zero
        max_vals[max_vals == 0] = 1.0
        X_new = X_new / max_vals
        
        X_aug.append(X_new)
        y_aug.append(y)
        
    return np.vstack(X_aug), np.concatenate(y_aug)

def build_model(input_shape):
    model = Sequential([
        Dense(256, activation='relu', input_shape=(input_shape,)),
        BatchNormalization(),
        Dropout(0.4),
        
        Dense(128, activation='relu'),
        BatchNormalization(),
        Dropout(0.4),
        
        Dense(64, activation='relu'),
        BatchNormalization(),
        Dropout(0.2),
        
        Dense(len(CLASSES), activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def main():
    print("Loading data...")
    X, y = load_data()
    print(f"Loaded {len(X)} original samples.")
    
    # Split BEFORE augmentation to prevent data leak from augmented train into test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)
    
    # Augment training data only
    X_train, y_train = augment_data(X_train, y_train, num_augments=4)
    print(f"Training on {len(X_train)} samples after augmentation. Testing on {len(X_test)} samples.")
    
    model = build_model(X_train.shape[1])
    model.summary()
    
    callbacks = [
        EarlyStopping(patience=10, restore_best_weights=True, monitor='val_accuracy'),
        ReduceLROnPlateau(factor=0.5, patience=5, min_lr=1e-5, monitor='val_loss')
    ]
    
    print("\nStarting training...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=100,
        batch_size=64,
        callbacks=callbacks
    )
    
    # Evaluate
    print("\nEvaluating on test set...")
    loss, accuracy = model.evaluate(X_test, y_test)
    print(f"Test Accuracy: {accuracy*100:.2f}%")
    
    # Detailed classification report
    y_pred = np.argmax(model.predict(X_test), axis=1)
    print(classification_report(y_test, y_pred, target_names=CLASSES))
    
    # Save
    model.save(MODEL_SAVE_PATH)
    print(f"\nModel saved successfully to {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    main()
