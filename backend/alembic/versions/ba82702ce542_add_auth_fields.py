from alembic import op
import sqlalchemy as sa


revision = 'add_auth_fields'
down_revision = 'add_veto_columns'
branch_labels = None
depends_on = None


def upgrade():

    op.add_column(
        'players',
        sa.Column(
            'email',
            sa.String(),
            nullable=True
        )
    )

    op.add_column(
        'players',
        sa.Column(
            'password_hash',
            sa.String(),
            nullable=True
        )
    )

    op.add_column(
        'players',
        sa.Column(
            'role',
            sa.String(),
            nullable=True
        )
    )


def downgrade():

    op.drop_column(
        'players',
        'email'
    )

    op.drop_column(
        'players',
        'password_hash'
    )

    op.drop_column(
        'players',
        'role'
    )
