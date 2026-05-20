from fastapi import Depends, Request
from fastapi.security import OAuth2PasswordBearer

from src.config import settings
from src.core.exceptions import UnauthorizedError
from src.database.db import get_db  # noqa: F401 — re-exported for routers
from src.services.auth_service import AuthService
from src.services.analytics_service import AnalyticsService
from src.services.conversation_service import ConversationService
from src.services.library_service import LibraryService
from src.services.user_service import UserService
from src.services.waitlist_service import WaitlistService
from src.services.token_service import validate_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token", auto_error=False)


def get_current_user_id(request: Request, bearer: str = Depends(oauth2_scheme)) -> int:
    token = bearer or request.cookies.get(settings.ACCESS_TOKEN_KEY)
    if not token:
        raise UnauthorizedError("Not authenticated")
    return validate_access_token(token)


# FastAPI resolves the full dependency chain from each service's __init__
get_auth_service = AuthService
get_user_service = UserService
get_conversation_service = ConversationService
get_library_service = LibraryService
get_analytics_service = AnalyticsService
get_waitlist_service = WaitlistService
