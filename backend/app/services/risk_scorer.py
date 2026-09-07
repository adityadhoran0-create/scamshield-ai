from typing import List, Dict, Tuple

def compute_risk(
    ml_probability: float,
    rule_score: float,
    url_score: float,
    signals: List[str],
    url_threats: List[str],
    category: str
) -> Tuple[int, str, float, str, List[str]]:
    """
    Synthesizes ML, Rule Heuristics, and URL Threat Signals into a final score,
    risk level, confidence score, XAI explanation, and safe user recommendations.
    """
    # 1. Weighted score calculation
    raw_score = (0.45 * ml_probability) + (0.35 * rule_score) + (0.20 * url_score)
    final_score = int(round(min(100.0, max(0.0, raw_score))))

    # 2. Risk Level Mapping
    if final_score >= 81:
        risk_level = "CRITICAL"
    elif final_score >= 51:
        risk_level = "HIGH"
    elif final_score >= 26:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # 3. Confidence Calculation
    # Higher agreement between ML & Rules increases confidence
    delta = abs(ml_probability - rule_score)
    base_confidence = 0.95 - (delta / 250.0)
    if url_score > 0:
        base_confidence += 0.04
    confidence = round(min(0.99, max(0.70, base_confidence)), 2)

    # 4. Generate Explainable AI Reasoning (XAI)
    explanation_parts = []
    
    if final_score >= 50:
        explanation_parts.append(
            f"This message exhibits strong characteristics commonly associated with scam attempts, categorized as '{category}'."
        )
    else:
        explanation_parts.append(
            "This message appears mostly routine or legitimate based on model patterns and heuristic checks."
        )

    if signals:
        explanation_parts.append(
            f"The system detected key risk signals including: {', '.join(signals[:3])}."
        )

    if url_threats:
        explanation_parts.append(
            f"URL security analysis flagged potential web threats: {', '.join(url_threats[:2])}."
        )

    explanation_parts.append(
        f"The predictive ML model assigned a scam probability of {ml_probability:.1f}%, while heuristic pattern engines evaluated rule risk at {rule_score:.1f}%."
    )

    explanation_parts.append(
        "Note: This is an automated AI-assisted risk assessment designed for verification support, NOT a guaranteed determination of fraud."
    )

    explanation = " ".join(explanation_parts)

    # 5. Generate Tailored Recommendations
    recommendations = []
    if final_score >= 50:
        recommendations.append("Do NOT click any links, open attachments, or download APK files included in this message.")
        recommendations.append("Never share your OTP, PIN, bank account password, CVV, or personal credentials with anyone.")
        recommendations.append("Verify any claim (bank block, prize win, courier delay) directly via the official website or customer support app.")
        recommendations.append("Report suspicious messages or SMS fraud to your telecom operator or National Cyber Crime Reporting Portal (cybercrime.gov.in).")
    else:
        recommendations.append("Always inspect links before clicking, even in messages that appear routine.")
        recommendations.append("Keep your device security patches and web browser up to date.")
        recommendations.append("If in doubt, double-check sender details or call the sender through a known trusted phone number.")

    return final_score, risk_level, confidence, explanation, recommendations
