
from alembic import op
import sqlalchemy as sa


# revision identifiers
revision = 'add_veto_columns'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():

    op.add_column(
        'matches',
        sa.Column(
            'map_pool',
            sa.String(),
            nullable=True
        )
    )

    op.add_column(
        'matches',
        sa.Column(
            'banned_maps',
            sa.String(),
            nullable=True
        )
    )

    op.add_column(
        'matches',
        sa.Column(
            'selected_map',
            sa.String(),
            nullable=True
        )
    )

    op.add_column(
        'matches',
        sa.Column(
            'veto_completed',
            sa.String(),
            nullable=True
        )
    )

    op.add_column(
        'matches',
        sa.Column(
            'veto_turn',
            sa.Integer(),
            nullable=True
        )
    )


def downgrade():

    op.drop_column(
        'matches',
        'map_pool'
    )

    op.drop_column(
        'matches',
        'banned_maps'
    )

    op.drop_column(
        'matches',
        'selected_map'
    )

    op.drop_column(
        'matches',
        'veto_completed'
    )

    op.drop_column(
        'matches',
        'veto_turn'
    )
