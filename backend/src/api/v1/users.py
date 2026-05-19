from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from src.core.dependencies import get_current_user_id, get_db
from src.schemas.user import DeleteAccount, PasswordChange, PasswordSet, UserUpdate
from src.services.auth_service import get_me
from src.services.user_service import (
    change_password,
    complete_onboarding,
    get_usage,
    remove_account,
    set_password,
    update_profile,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
def me(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return get_me(db, user_id)


@router.patch("/me")
def update_me(body: UserUpdate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return update_profile(db, user_id, body.full_name)


@router.patch("/me/password")
def change_pw(body: PasswordChange, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return change_password(db, user_id, body.current_password, body.new_password)


@router.patch("/me/password/set")
def set_pw(body: PasswordSet, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return set_password(db, user_id, body.new_password)


@router.delete("/me")
def delete_me(
    body: DeleteAccount,
    response: Response,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    result = remove_account(db, user_id, body.confirmation)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return result


@router.get("/me/usage")
def usage(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return get_usage(db, user_id)


@router.post("/me/onboarding-complete")
def onboarding_complete(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return complete_onboarding(db, user_id)
