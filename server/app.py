from flask import Flask
from flask_restful import Resource as RestfulResource, Api
from config import db, ApplicationConfig
from flask_migrate import Migrate 
from models import User, Topic, Subtopic, Resource, Candidate, CandidateSubtopic, UserSubtopicPreference
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
app.config.from_object(ApplicationConfig)
migrate = Migrate(app, db)
db.init_app( app )

api = Api(app)

class Users(RestfulResource):
    def get(self):
        users = User.query.all()
        return [u.to_dict() for u in users], 200
api.add_resource(Users, '/users')

class Topics(RestfulResource):
    def get(self):
        topics = Topic.query.all()
        return [t.to_dict() for t in topics], 200
api.add_resource(Topics, '/topics')

class Subtopics(RestfulResource):
    def get(self):
        sts = Subtopic.query.all()
        return [s.to_dict() for s in sts], 200
api.add_resource(Subtopics, '/subtopics')

class Resources(RestfulResource):
    def get(self):
        rs = Resource.query.all()
        return [r.to_dict() for r in rs], 200   
api.add_resource(Resources, '/resources')

class Candidates(RestfulResource):
    def get(self):
        cs = Candidate.query.all()
        return [c.to_dict() for c in cs], 200
api.add_resource(Candidates, '/candidates')

class CandidateSubtopics(RestfulResource):
    def get(self):
        c_sts = CandidateSubtopic.query.all()
        return [cs.to_dict() for cs in c_sts], 200
api.add_resource(CandidateSubtopics, '/candidate-subtopics')

class SubtopicPreferences(RestfulResource):
    def get(self):
        sps = UserSubtopicPreference.query.all()
        return [sp.to_dict() for sp in sps], 200
api.add_resource(SubtopicPreferences, '/subtopic-preferences')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

