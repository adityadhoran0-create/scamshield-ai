import os
import re
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score, f1_score, precision_score, recall_score

def clean_text(text: str) -> str:
    """Normalize text while preserving key indicators like URLs, currency, exclamation marks."""
    if not isinstance(text, str):
        return ""
    
    text = text.lower()
    # Normalize numbers but keep currency symbols
    text = re.sub(r'https?://\S+|www\.\S+', ' httpurl ', text)
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', ' emailaddr ', text)
    text = re.sub(r'\b\d{10}\b', ' phonenum ', text)
    text = re.sub(r'[\u20B9\$]\s*\d+', ' moneyval ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def train():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, "data", "scam_dataset.csv")
    model_dir = os.path.join(current_dir, "model")
    model_path = os.path.join(model_dir, "scam_classifier.joblib")

    os.makedirs(model_dir, exist_ok=True)

    print(f"[*] Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    print(f"[*] Dataset shape: {df.shape}")
    print(f"[*] Class distribution:\n{df['label'].value_counts()}")

    # Preprocessing
    df['cleaned_text'] = df['text'].apply(clean_text)

    X = df['cleaned_text']
    y = df['label']

    # Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"[*] Training on {len(X_train)} samples, testing on {len(X_test)} samples...")

    # Build Pipeline
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            ngram_range=(1, 3),
            max_features=5000,
            sublinear_tf=True,
            min_df=1
        )),
        ('clf', LogisticRegression(
            C=2.5,
            class_weight='balanced',
            random_state=42,
            max_iter=1000
        ))
    ])

    # Fit pipeline
    pipeline.fit(X_train, y_train)

    # Evaluate
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)

    print("\n" + "="*50)
    print("      MODEL EVALUATION METRICS (TEST SET)")
    print("="*50)
    print(f"Accuracy : {acc * 100:.2f}%")
    print(f"Precision: {prec * 100:.2f}%")
    print(f"Recall   : {rec * 100:.2f}%")
    print(f"F1-Score : {f1 * 100:.2f}%")
    print("\nDetailed Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Legitimate', 'Scam']))
    print("="*50)

    # Save model pipeline
    payload = {
        "pipeline": pipeline,
        "metrics": {
            "accuracy": float(acc),
            "precision": float(prec),
            "recall": float(rec),
            "f1_score": float(f1),
            "train_samples": len(X_train),
            "test_samples": len(X_test)
        }
    }

    joblib.dump(payload, model_path)
    print(f"\n[+] Trained model pipeline saved successfully to:\n    {model_path}")

if __name__ == "__main__":
    train()
