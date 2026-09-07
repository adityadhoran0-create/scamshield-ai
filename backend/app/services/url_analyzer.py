import re
from urllib.parse import urlparse
from typing import List, Dict, Tuple

SHORTENER_DOMAINS = {
    'bit.ly', 'tinyurl.com', 'rb.gy', 'is.gd', 't.co', 'cutt.ly',
    'shorturl.at', 'ow.ly', 'buff.ly', 'tiny.cc', 'bc.vc', 'adf.ly'
}

SUSPICIOUS_TLDS = {
    '.xyz', '.top', '.tk', '.ml', '.ga', '.club', '.work', '.site',
    '.info', '.apk', '.cf', '.fit', '.monster', '.icu', '.buzz', '.rest'
}

BRAND_KEYWORDS = [
    'sbi', 'hdfc', 'icici', 'axis', 'paytm', 'gpay', 'phonepe', 'kbc',
    'amazon', 'flipkart', 'netflix', 'google', 'whatsapp', 'facebook',
    'instagram', 'apple', 'gov', 'incometax', 'indiapost', 'customs',
    'fedex', 'dhl', 'trai', 'rbi', 'lic', 'yono', 'kyc', 'pan', 'aadhar'
]

SUSPICIOUS_ACTION_KEYWORDS = [
    'verify', 'update', 'claim', 'login', 'security', 'secure', 'reward',
    'winner', 'bonus', 'free', 'recharge', 'refund', 'account', 'block',
    'unlock', 'suspend', 'support', 'gift', 'lottery', 'payout'
]

def extract_urls(text: str) -> List[str]:
    """Extract all HTTP/HTTPS and domain-like URLs from message text without opening them."""
    pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
    urls = re.findall(pattern, text)
    # Clean trailing punctuation
    cleaned_urls = []
    for url in urls:
        cleaned = url.rstrip('.,;!?:)')
        if cleaned:
            cleaned_urls.append(cleaned)
    return cleaned_urls

def analyze_urls(text: str) -> Tuple[List[str], List[str], float]:
    """
    Analyzes URLs safely using passive characteristics.
    Returns:
    - extracted_urls: List[str]
    - url_threats: List[str]
    - url_score: float (0.0 to 100.0)
    """
    urls = extract_urls(text)
    if not urls:
        return [], [], 0.0

    url_threats = []
    total_score = 0.0

    for url in urls:
        parsed = urlparse(url)
        netloc = parsed.netloc.lower()
        scheme = parsed.scheme.lower()
        path = parsed.path.lower()

        # 1. HTTP instead of HTTPS
        if scheme == 'http':
            url_threats.append("Insecure HTTP protocol detected (lacks SSL encryption)")
            total_score += 20.0

        # 2. IP Address in Host
        if re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', netloc):
            url_threats.append("Raw IP Address host detected (commonly used by attackers)")
            total_score += 40.0

        # 3. URL Shortener
        if any(shortener in netloc for shortener in SHORTENER_DOMAINS):
            url_threats.append("Known URL shortener detected (hides true destination)")
            total_score += 25.0

        # 4. Suspicious TLD
        if any(netloc.endswith(tld) for tld in SUSPICIOUS_TLDS) or netloc.endswith('.apk'):
            url_threats.append(f"High-risk top-level domain detected in URL: {netloc}")
            total_score += 35.0

        # 5. Excessive Subdomains (>= 3 dots)
        domain_parts = netloc.split('.')
        if len(domain_parts) >= 4:
            url_threats.append("Excessive subdomains detected (domain spoofing tactic)")
            total_score += 25.0

        # 6. Brand Keyword + Action Keyword in Domain (e.g. sbi-kyc-update.xyz)
        has_brand = any(brand in netloc for brand in BRAND_KEYWORDS)
        has_action = any(act in netloc or act in path for act in SUSPICIOUS_ACTION_KEYWORDS)
        if has_brand and has_action:
            url_threats.append("Brand impersonation & phishing path keywords detected in URL")
            total_score += 40.0

        # 7. Unusual symbols in URL (@, double hyphens)
        if '@' in url or '--' in netloc:
            url_threats.append("Unusual obfuscation characters ('@' or '--') found in URL")
            total_score += 20.0

        # 8. Direct APK download link
        if '.apk' in path or '.exe' in path:
            url_threats.append("Direct malicious executable/APK file download link detected")
            total_score += 50.0

    # Ensure "Suspicious URL detected" general signal is present if any threat identified
    if url_threats and "Suspicious URL detected" not in url_threats:
        url_threats.insert(0, "Suspicious URL detected")

    # Deduplicate threats preserving order
    dedup_threats = list(dict.fromkeys(url_threats))
    final_url_score = min(100.0, max(0.0, total_score))

    return urls, dedup_threats, final_url_score
