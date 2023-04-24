from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from config import *

db = SQLAlchemy()

class User(db.Model):
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)


    subtopic_preferences = relationship('UserSubtopicPreference', backref='user')

class Topic(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


    subtopics = relationship('Subtopic', backref='topic')

class Subtopic(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    topic_id = Column(Integer, ForeignKey('topic.id'))


    resources = relationship('Resource', backref='subtopic')
    user_preferences = relationship('UserSubtopicPreference', backref='subtopic')
    candidate_subtopics = relationship('CandidateSubtopic', backref='subtopic')

class Resource(db.Model):
    id = Column(Integer, primary_key=True)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    subtopic_id = Column(Integer, ForeignKey('subtopic.id'))

class Candidate(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    image_url = Column(String)

    
    candidate_subtopics = relationship('CandidateSubtopic', backref='candidate')

class CandidateSubtopic(db.Model):
    id = Column(Integer, primary_key=True)
    candidate_id = Column(Integer, ForeignKey('candidate.id'))
    subtopic_id = Column(Integer, ForeignKey('subtopic.id'))

class UserSubtopicPreference(db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    subtopic_id = Column(Integer, ForeignKey('subtopic.id'))
    priority = Column(Integer, nullable=False)
