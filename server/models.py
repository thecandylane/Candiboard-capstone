from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from config import *
from uuid import uuid4

def get_uuid():
    return uuid4().hex

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, default=get_uuid, nullable=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    admin = db.Column(db.Boolean, nullable=False)

    subtopic_preferences = db.relationship('UserSubtopicPreference', back_populates='user')

    serialize_only = ('id', 'username', 'email')

class Topic(db.Model, SerializerMixin):
    __tablename__ = 'topics'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    subtopics = db.relationship('Subtopic', back_populates='topic')

    serialize_only = ('id', 'name', 'subtopics')

class Subtopic(db.Model, SerializerMixin):
    __tablename__ = 'subtopics'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'))

    topic = db.relationship('Topic', back_populates='subtopics')
    resources = db.relationship('Resource', back_populates='subtopic')
    user_preferences = db.relationship('UserSubtopicPreference', back_populates='subtopic')
    candidate_subtopics = db.relationship('CandidateSubtopic', back_populates='subtopic')

    serialize_only = ('id', 'name', 'topic_id')

class Resource(db.Model, SerializerMixin):
    __tablename__ = 'resources'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String, nullable=False)
    title = db.Column(db.String, nullable=False)
    url = db.Column(db.String, nullable=False)
    subtopic_id = db.Column(db.Integer, db.ForeignKey('subtopics.id'))

    subtopic = db.relationship('Subtopic', back_populates='resources')

    serialize_only = ('id', 'type', 'title', 'url', 'subtopic_id')

class Candidate(db.Model, SerializerMixin):
    __tablename__ = 'candidates'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String)

    candidate_subtopics = db.relationship('CandidateSubtopic', back_populates='candidate')

    serialize_only = ('id', 'name', 'image_url')

class CandidateSubtopic(db.Model, SerializerMixin):
    __tablename__ = 'candidate_subtopics'

    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'))
    subtopic_id = db.Column(db.Integer, db.ForeignKey('subtopics.id'))

    candidate = db.relationship('Candidate', back_populates='candidate_subtopics')
    subtopic = db.relationship('Subtopic', back_populates='candidate_subtopics')

    serialize_only = ('id', 'candidate_id', 'subtopic_id')

class UserSubtopicPreference(db.Model, SerializerMixin):
    __tablename__ = 'subtopic_preferences'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    subtopic_id = db.Column(db.Integer, db.ForeignKey('subtopics.id'))
    priority = db.Column(db.Integer, nullable=False)

    user = db.relationship('User', back_populates='subtopic_preferences')
    subtopic = db.relationship('Subtopic', back_populates='user_preferences')

    serialize_only = ('id', 'user_id', 'subtopic_id', 'priority')

