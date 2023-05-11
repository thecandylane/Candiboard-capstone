"""final draft

Revision ID: 0dcd42136c91
Revises: 
Create Date: 2023-05-10 23:25:59.128232

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0dcd42136c91'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('candidates',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('image_url', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('topics',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('public_id', sa.String(length=36), nullable=True),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('admin', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('public_id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('subtopics',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('topic_id', sa.Integer(), nullable=True),
    sa.Column('description', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['topic_id'], ['topics.id'], name=op.f('fk_subtopics_topic_id_topics')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('candidate_subtopics',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('candidate_id', sa.Integer(), nullable=True),
    sa.Column('subtopic_id', sa.Integer(), nullable=True),
    sa.Column('weight', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['candidate_id'], ['candidates.id'], name=op.f('fk_candidate_subtopics_candidate_id_candidates')),
    sa.ForeignKeyConstraint(['subtopic_id'], ['subtopics.id'], name=op.f('fk_candidate_subtopics_subtopic_id_subtopics')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('resources',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('url', sa.String(), nullable=False),
    sa.Column('subtopic_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['subtopic_id'], ['subtopics.id'], name=op.f('fk_resources_subtopic_id_subtopics')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('subtopic_preferences',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('subtopic_id', sa.Integer(), nullable=True),
    sa.Column('priority', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['subtopic_id'], ['subtopics.id'], name=op.f('fk_subtopic_preferences_subtopic_id_subtopics')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_subtopic_preferences_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('subtopic_preferences')
    op.drop_table('resources')
    op.drop_table('candidate_subtopics')
    op.drop_table('subtopics')
    op.drop_table('users')
    op.drop_table('topics')
    op.drop_table('candidates')
    # ### end Alembic commands ###