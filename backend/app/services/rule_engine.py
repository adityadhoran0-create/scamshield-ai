import re
from typing import List, Dict, Tuple

# Signal Categories with Weights and Regex Patterns
RULE_PATTERNS = [
    {
        "name": "Urgent language & time pressure",
        "weight": 20.0,
        "patterns": [
            r"\b(immediately|urgent|urgently|right now|act fast|today only|within \d+ (hours?|mins?)|expires? (today|tonight)|hurry|fast|asap)\b",
            r"\b(abhibhi|jaldi|turant|aaj hi|2 ghante me)\b"
        ]
    },
    {
        "name": "OTP / Credential request",
        "weight": 35.0,
        "patterns": [
            r"\b(otp|one time password|pin|cvv|password|netbanking|login credentials|security code)\b",
            r"\b(share otp|enter pin|share 6-digit|send pin)\b"
        ]
    },
    {
        "name": "Unrealistic reward / Prize claim",
        "weight": 25.0,
        "patterns": [
            r"\b(congratulations|won|winner|lottery|lotto|cashback|lucky draw|free gift|claim reward|kbc|25 lakhs|50,000|1,00,000)\b",
            r"\b(badhai ho|jeeta hai|cashback reward|prize claim)\b"
        ]
    },
    {
        "name": "Account suspension threat",
        "weight": 30.0,
        "patterns": [
            r"\b(account (will be|has been) (suspended|blocked|locked|deactivated|closed)|access blocked|access disabled)\b",
            r"\b(block ho gaya|account band|kyc expired|pan card update)\b"
        ]
    },
    {
        "name": "Financial / Advance payment demand",
        "weight": 25.0,
        "patterns": [
            r"\b(transfer money|pay fee|deposit|processing fee|clearance charge|penalty fee|delivery fee|customs duty|pay ₹\d+)\b",
            r"\b(registration fee|advance payment|send money to upi)\b"
        ]
    },
    {
        "name": "High yield job / Easy income promise",
        "weight": 25.0,
        "patterns": [
            r"\b(work from home|earn ₹?\d+ daily|daily payout|like youtube|typing job|captcha job|part time job|no investment)\b",
            r"\b(ghar baite kamao|daily salary)\b"
        ]
    },
    {
        "name": "Authority / Brand impersonation",
        "weight": 20.0,
        "patterns": [
            r"\b(rbi|sbi|hdfc|icici|axis|paytm|trai|income tax|customs department|police warrant|dhl|fedex|indiapost|gov)\b",
            r"\b(electricity department|bank official|cybercrime)\b"
        ]
    },
    {
        "name": "Unsolicited contact / Off-platform redirect",
        "weight": 15.0,
        "patterns": [
            r"\b(contact telegram|whatsapp me|join vip channel|telegram @\w+|click link below)\b"
        ]
    },
    {
        "name": "Excessive caps & panic punctuation",
        "weight": 10.0,
        "patterns": [
            r"([A-Z]{4,}\s+){2,}",
            r"(!{3,}|\?{3,})"
        ]
    },
    {
        "name": "Hinglish vulnerability pattern",
        "weight": 25.0,
        "patterns": [
            r"\b(block ho gaya|pan update karo|link par click|paise jeete|inbox me pin|fine lagega|lotto me|account chalu)\b"
        ]
    }
]

def analyze_rules(text: str) -> Tuple[List[str], float]:
    """
    Evaluates rule-based social engineering risk signals.
    Returns:
    - detected_signals: List[str]
    - total_rule_score: float (0.0 to 100.0)
    """
    if not text:
        return [], 0.0

    detected_signals = []
    total_score = 0.0

    for rule in RULE_PATTERNS:
        rule_name = rule["name"]
        weight = rule["weight"]
        matched = False

        for pattern in rule["patterns"]:
            if re.search(pattern, text, re.IGNORECASE):
                matched = True
                break

        if matched:
            detected_signals.append(rule_name)
            total_score += weight

    final_rule_score = min(100.0, max(0.0, total_score))
    return detected_signals, final_rule_score
