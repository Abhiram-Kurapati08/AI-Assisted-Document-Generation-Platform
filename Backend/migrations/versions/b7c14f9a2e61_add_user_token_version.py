"""Add refresh token version for rotation and revocation.

Revision ID: b7c14f9a2e61
Revises: d00cff999475
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b7c14f9a2e61"
down_revision: Union[str, Sequence[str], None] = "d00cff999475"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("token_version", sa.Integer(), server_default="0", nullable=False),
    )


def downgrade() -> None:
    op.drop_column("users", "token_version")
