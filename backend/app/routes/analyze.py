from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from typing import List

from app.schemas.payload import AnalyzeRequest, AnalyzeResponse, HealthResponse, DemoMessage
from app.services.ml_engine import ml_engine
from app.services.rule_engine import analyze_rules
from app.services.url_analyzer import analyze_urls
from app.services.category_classifier import classify_category
from app.services.risk_scorer import compute_risk

router = APIRouter()

DEMO_MESSAGES = [
    DemoMessage(
        id="prize_scam",
        title="Prize / KBC Lottery Scam",
        category="Prize / Lottery Scam",
        description="Classic reward claim with fake link and extreme urgency.",
        message="Congratulations! You have won ₹50,000 in KBC Lottery. Claim your reward immediately by clicking this link: http://kbc-winner-reward.xyz/claim. Your account will expire today!"
    ),
    DemoMessage(
        id="bank_kyc",
        title="HDFC / SBI Bank KYC Threat",
        category="Banking / Financial Scam",
        description="Fake bank account block threat asking for PAN update.",
        message="Urgent: Your HDFC Bank account will be suspended today due to pending KYC update. Click http://hdfc-bank-kyc-update.top to update PAN card details now."
    ),
    DemoMessage(
        id="job_wfh",
        title="Work From Home / Daily Salary Scam",
        category="Job Scam",
        description="Unrealistic daily income claim requiring Telegram contact.",
        message="Earn ₹5,000 to ₹10,000 per day by liking YouTube videos from home! No experience required. Contact Telegram @easy_income_daily now."
    ),
    DemoMessage(
        id="delivery_parcel",
        title="India Post / Customs Delivery Scam",
        category="Delivery / Parcel Scam",
        description="Pending delivery scam with redelivery link fee.",
        message="Your India Post parcel #IN984210 could not be delivered due to incomplete delivery address. Update details & pay ₹49 redelivery fee at http://indiapost-parcel.top/update"
    ),
    DemoMessage(
        id="hinglish_sbi",
        title="Hinglish Bank Block Alert",
        category="Banking / Financial Scam",
        description="Scam written in common Hinglish conversational style.",
        message="Aapka SBI account block ho gaya hai. Abhi PAN Card update kare link par click karke: http://sbi-pan-update.xyz aksar late karne par fine lagega."
    ),
    DemoMessage(
        id="legit_otp",
        title="Legitimate Bank Transaction OTP",
        category="Legitimate Message",
        description="Standard safe bank OTP warning.",
        message="Your OTP for ICICI Bank netbanking login is 482910. Do not share this OTP with anyone, including bank officials."
    )
]

@router.post("/analyze", response_model=AnalyzeResponse, status_code=status.HTTP_200_OK)
async def analyze_message(payload: AnalyzeRequest):
    message_text = payload.message.strip()
    if not message_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content cannot be empty or whitespace only."
        )

    if len(message_text) > 5000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message exceeds maximum allowed length of 5000 characters."
        )

    # 1. URL passive safety analysis
    urls, url_threats, url_score = analyze_urls(message_text)

    # 2. Heuristic rule signal engine
    rule_signals, rule_score = analyze_rules(message_text)

    # 3. ML Model prediction
    ml_probability, model_info = ml_engine.predict(message_text)

    # Combine signals
    all_signals = list(dict.fromkeys(rule_signals + url_threats))

    # Preliminary scam determination for category matching
    is_scam_preliminary = (ml_probability > 45.0) or (rule_score > 30.0) or (url_score > 30.0)

    # 4. Scam Category Classification
    scam_category = classify_category(message_text, all_signals, is_scam_preliminary)

    # 5. Hybrid Risk Scoring & XAI Generation
    risk_score, risk_level, confidence, explanation, recommendations = compute_risk(
        ml_probability=ml_probability,
        rule_score=rule_score,
        url_score=url_score,
        signals=all_signals,
        url_threats=url_threats,
        category=scam_category
    )

    return AnalyzeResponse(
        risk_score=risk_score,
        risk_level=risk_level,
        category=scam_category,
        confidence=confidence,
        signals=all_signals,
        explanation=explanation,
        recommendations=recommendations,
        ml_probability=round(ml_probability, 1),
        rule_score=round(rule_score, 1),
        url_score=round(url_score, 1),
        extracted_urls=urls,
        url_threats=url_threats,
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        model_loaded=ml_engine.is_loaded,
        version="1.0.0",
        model_metrics=ml_engine.metrics
    )

@router.get("/demos", response_model=List[DemoMessage])
async def get_demo_messages():
    return DEMO_MESSAGES
