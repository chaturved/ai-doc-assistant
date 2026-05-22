import os

# Must be set before any src.* imports so pydantic-settings can validate them
os.environ.setdefault("JWT_SECRET_KEY", "test-jwt-secret-key-for-testing-only")
os.environ.setdefault("SESSION_SECRET_KEY", "test-session-secret-key-for-testing")
