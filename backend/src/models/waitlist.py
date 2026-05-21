from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from ..database.db import Base


class Waitlist(Base):
    __tablename__ = "waitlist"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, server_default=func.now())
