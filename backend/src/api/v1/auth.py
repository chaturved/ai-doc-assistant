from fastapi import APIRouter, Depends, Request, Response
from fastapi.security import OAuth2PasswordRequestForm

from src.core.dependencies import get_auth_service, get_current_user_id
from src.schemas.user import ForgotPasswordRequest, MagicLinkRequest, ResetPasswordRequest, UserCreate
from src.services.auth_service import IAuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup")
def signup_route(user_in: UserCreate, response: Response, service: IAuthService = Depends(get_auth_service)):
    return service.signup(user_in, response)


@router.post("/login")
def login_route(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: IAuthService = Depends(get_auth_service),
):
    return service.login(response, form_data)


@router.post("/token", include_in_schema=False)
def token_route(form_data: OAuth2PasswordRequestForm = Depends(), service: IAuthService = Depends(get_auth_service)):
    return service.authorize_token(form_data)


@router.post("/logout")
def logout_route(response: Response, service: IAuthService = Depends(get_auth_service)):
    return service.logout(response)


@router.post("/refresh")
def refresh_route(request: Request, response: Response, service: IAuthService = Depends(get_auth_service)):
    return service.refresh(request, response)


@router.get("/me")
def me_route(user_id: int = Depends(get_current_user_id), service: IAuthService = Depends(get_auth_service)):
    return service.get_me(user_id)


@router.get("/google")
async def google_login(request: Request, service: IAuthService = Depends(get_auth_service)):
    return await service.google_redirect(request)


@router.get("/google/callback")
async def google_cb(request: Request, response: Response, service: IAuthService = Depends(get_auth_service)):
    return await service.google_callback(request, response)


@router.post("/magic-link")
def magic_link(body: MagicLinkRequest, service: IAuthService = Depends(get_auth_service)):
    return service.send_magic_link(body.email)


@router.get("/magic-link/verify")
def magic_link_verify(token: str, response: Response, service: IAuthService = Depends(get_auth_service)):
    return service.verify_magic_link(token, response)


@router.post("/forgot-password")
def forgot_pw(body: ForgotPasswordRequest, service: IAuthService = Depends(get_auth_service)):
    return service.forgot_password(body.email)


@router.post("/reset-password")
def reset_pw(body: ResetPasswordRequest, service: IAuthService = Depends(get_auth_service)):
    return service.reset_password(body.token, body.new_password)
