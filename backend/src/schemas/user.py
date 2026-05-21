from pydantic import BaseModel, EmailStr


# ─── Request schemas ──────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserUpdate(BaseModel):
    full_name: str


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


class PasswordSet(BaseModel):
    new_password: str


class DeleteAccount(BaseModel):
    confirmation: str


class MagicLinkRequest(BaseModel):
    email: EmailStr


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class WaitlistRequest(BaseModel):
    email: EmailStr


# ─── Response schemas ─────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    plan: str
    avatar_initials: str
    onboarding_completed: bool

    model_config = {"from_attributes": True}


class ProfileResponse(BaseModel):
    id: int
    email: str
    full_name: str
    avatar_initials: str

    model_config = {"from_attributes": True}


class UsageItemResponse(BaseModel):
    used: int
    limit: int | None


class UsageResponse(BaseModel):
    documents: UsageItemResponse
    queries_today: UsageItemResponse
    storage_bytes: UsageItemResponse


class MessageResponse(BaseModel):
    message: str


class AuthResponse(BaseModel):
    user: UserResponse


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
