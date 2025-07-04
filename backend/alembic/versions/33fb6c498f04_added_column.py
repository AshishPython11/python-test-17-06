"""added column

Revision ID: 33fb6c498f04
Revises: 6467674a23c4
Create Date: 2025-06-24 15:16:15.260196

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '33fb6c498f04'
down_revision: Union[str, Sequence[str], None] = '6467674a23c4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('movies', sa.Column('release_year', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('movies', 'release_year')
    # ### end Alembic commands ###
