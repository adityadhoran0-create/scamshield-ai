import re
from typing import List

CATEGORIES = [
    "Phishing",
    "Banking / Financial Scam",
    "OTP / Credential Scam",
    "Prize / Lottery Scam",
    "Job Scam",
    "Delivery / Parcel Scam",
    "Investment Scam",
    "Account Takeover",
    "Impersonation",
    "Romance / Social Engineering",
    "Suspicious / Other"
]

def classify_category(text: str, signals: List[str], is_scam: bool) -> str:
    """Classify message into one of the 11 scam categories based on signals and text semantics."""
    if not is_scam:
        return "Legitimate Message"

    text_lower = text.lower()

    # 1. OTP / Credential Theft
    if any(sig in signals for sig in ["OTP / Credential request"]) or re.search(r'\b(otp|pin|cvv|netbanking password)\b', text_lower):
        return "OTP / Credential Scam"

    # 2. Prize / Lottery
    if any(sig in signals for sig in ["Unrealistic reward / Prize claim"]) or re.search(r'\b(lottery|kbc|won|winner|cashback|lucky draw)\b', text_lower):
        return "Prize / Lottery Scam"

    # 3. Delivery / Parcel
    if re.search(r'\b(courier|parcel|delivery|indiapost|customs|dhl|fedex|shipment|tracking)\b', text_lower):
        return "Delivery / Parcel Scam"

    # 4. Job Scam
    if any(sig in signals for sig in ["High yield job / Easy income promise"]) or re.search(r'\b(work from home|part time job|captcha|youtube|daily payout)\b', text_lower):
        return "Job Scam"

    # 5. Investment / Crypto
    if re.search(r'\b(crypto|bitcoin|usdt|investment|trading|double money|forex|high yield)\b', text_lower):
        return "Investment Scam"

    # 6. Banking / Financial
    if re.search(r'\b(sbi|hdfc|icici|axis|paytm|yono|kyc|pan card|bank account|upi)\b', text_lower):
        return "Banking / Financial Scam"

    # 7. Impersonation
    if re.search(r'\b(police|warrant|income tax|trai|electricity department|customs department|rbi)\b', text_lower):
        return "Impersonation"

    # 8. Account Takeover / Threat
    if any(sig in signals for sig in ["Account suspension threat"]) or re.search(r'\b(whatsapp block|facebook page|netflix expired|account suspended)\b', text_lower):
        return "Account Takeover"

    # 9. Romance / Social Engineering
    if re.search(r'\b(handsome|honey|lonely|missed you|private photos|accident|hospital bill)\b', text_lower):
        return "Romance / Social Engineering"

    # 10. Phishing
    if any(sig in signals for sig in ["Suspicious URL detected"]) or "http" in text_lower:
        return "Phishing"

    return "Suspicious / Other"
