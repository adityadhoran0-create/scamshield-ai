import os
import joblib
from typing import Tuple, Dict, Any

class MLEngine:
    def __init__(self):
        self.pipeline = None
        self.metrics = None
        self.is_loaded = False
        self._load_model()

    def _load_model(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # Path: backend/model/scam_classifier.joblib
        model_path = os.path.abspath(os.path.join(current_dir, "..", "..", "model", "scam_classifier.joblib"))
        
        if os.path.exists(model_path):
            try:
                payload = joblib.load(model_path)
                self.pipeline = payload.get("pipeline")
                self.metrics = payload.get("metrics")
                self.is_loaded = True
                print(f"[+] Loaded ML model pipeline from: {model_path}")
            except Exception as e:
                print(f"[!] Error loading ML model: {e}")
                self.is_loaded = False
        else:
            print(f"[!] Model file not found at {model_path}. ML predictions will use fallback baseline.")
            self.is_loaded = False

    def predict(self, text: str) -> Tuple[float, Dict[str, Any]]:
        """
        Runs ML inference on input text.
        Returns:
        - scam_probability: float (0.0 to 100.0)
        - model_info: Dict[str, Any]
        """
        if not self.is_loaded or self.pipeline is None:
            # Fallback baseline heuristic if model not serialized
            return 50.0, {"loaded": False, "note": "Model file missing, using baseline"}

        try:
            # Clean text (matching cleaning in train_model.py)
            import re
            cleaned = text.lower()
            cleaned = re.sub(r'https?://\S+|www\.\S+', ' httpurl ', cleaned)
            cleaned = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', ' emailaddr ', cleaned)
            cleaned = re.sub(r'\b\d{10}\b', ' phonenum ', cleaned)
            cleaned = re.sub(r'[\u20B9\$]\s*\d+', ' moneyval ', cleaned)
            cleaned = re.sub(r'\s+', ' ', cleaned).strip()

            # Predict probability of scam (class 1)
            probabilities = self.pipeline.predict_proba([cleaned])[0]
            scam_prob = float(probabilities[1]) * 100.0

            return scam_prob, {
                "loaded": True,
                "metrics": self.metrics
            }
        except Exception as e:
            print(f"[!] Inference error: {e}")
            return 50.0, {"loaded": True, "error": str(e)}

# Singleton instance
ml_engine = MLEngine()
