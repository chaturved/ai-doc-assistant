from fastapi import APIRouter, Depends, Response

from src.core.dependencies import get_auth_service, get_current_user_id, get_user_service
from src.schemas.user import DeleteAccount, PasswordChange, PasswordSet, UserUpdate
from src.services.auth_service import IAuthService
from src.services.user_service import IUserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
def me(user_id: int = Depends(get_current_user_id), service: IAuthService = Depends(get_auth_service)):
    return service.get_me(user_id)


@router.patch("/me")
def update_me(
    body: UserUpdate,
    user_id: int = Depends(get_current_user_id),
    service: IUserService = Depends(get_user_service),
):
    return service.update_profile(user_id, body.full_name)


@router.patch("/me/password")
def change_pw(
    body: PasswordChange,
    user_id: int = Depends(get_current_user_id),
    service: IUserService = Depends(get_user_service),
):
    return service.change_password(user_id, body.current_password, body.new_password)


@router.patch("/me/password/set")
def set_pw(
    body: PasswordSet,
    user_id: int = Depends(get_current_user_id),
    service: IUserService = Depends(get_user_service),
):
    return service.set_password(user_id, body.new_password)


@router.delete("/me")
def delete_me(
    body: DeleteAccount,
    response: Response,
    user_id: int = Depends(get_current_user_id),
    service: IUserService = Depends(get_user_service),
):
    result = service.remove_account(user_id, body.confirmation)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return result


@router.get("/me/usage")
def usage(user_id: int = Depends(get_current_user_id), service: IUserService = Depends(get_user_service)):
    return service.get_usage(user_id)


@router.post("/me/onboarding-complete")
def onboarding_complete(user_id: int = Depends(get_current_user_id), service: IUserService = Depends(get_user_service)):
    return service.complete_onboarding(user_id)
