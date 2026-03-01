import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Tuple


PBKDF2_ITERATIONS = 120_000


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
    return f"{salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        salt_hex, digest_hex = encoded.split("$", 1)
    except ValueError:
        return False
    salt = bytes.fromhex(salt_hex)
    expected = bytes.fromhex(digest_hex)
    actual = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
    return hmac.compare_digest(expected, actual)


def new_token(length: int = 32) -> str:
    return secrets.token_urlsafe(length)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def expiry_after_hours(hours: int) -> Tuple[str, datetime]:
    exp_dt = utc_now() + timedelta(hours=hours)
    return exp_dt.isoformat(), exp_dt
