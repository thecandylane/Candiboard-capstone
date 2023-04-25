from flask import Flask, request, make_response, jsonify
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

    def post(self):
        data = request.get_json()
        try:
            user = User(
            username=data['username'],
            email=data['email'],
            password=data['password']
            )
            db.session.add(user)
            db.session.commit()
        except Exception as e:
            return make_response({
                'errors':[e.__str__()]
            }, 422)
        return user.to_dict(), 201

api.add_resource(Users, '/users')

class UserById(RestfulResource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"error":"User not found"}, 404
        return user.to_dict(), 200

    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"error":"User not found"}, 404
        data = request.get_json()
        for key in data.keys():
            setattr(user, key, data[key])
        db.session.add(user)
        db.session.commit()
        return user.to_dict(), 200
    
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"error":"User not found"}, 404
        db.session.delete(user)
        db.session.commit()
        return {'':''}, 204

api.add_resource(UserById, '/users/<int:id>')
    
class Topics(RestfulResource):
    def get(self):
        topics = Topic.query.all()
        return [t.to_dict() for t in topics], 200
    
    def post(self):
        data = request.get_json()
        try:
            topic = Topic(name=data['name'])
            db.session.add(topic)
            db.session.commit()
        except Exception as e:
            return make_response({"errors":[e.__str__()]})
        return topic.to_dict(), 201

api.add_resource(Topics, '/topics')

class TopicById(RestfulResource):
    def get(self, id):
        topic = Topic.query.filter_by(id=id).first()
        if not topic:
            return {"error":"Topic not found"}, 404
        return topic.to_dict(), 200

    def patch(self, id):
        topic = Topic.query.filter_by(id=id).first()
        if not topic:
            return {"error":"Topic not found"}, 404
        data = request.get_json()
        for key in data.keys():
            setattr(topic, key, data[key])
        db.session.add(topic)
        db.session.commit()
        return topic.to_dict(), 200
    
    def delete(self, id):
        topic = Topic.query.filter_by(id=id).first()
        if not topic:
            return {"error":"Topic not found"}, 404
        db.session.delete(topic)
        db.session.commit()
        return {'':''}, 204

api.add_resource(TopicById, '/topics/<int:id>')

class Subtopics(RestfulResource):
    def get(self):
        sts = Subtopic.query.all()
        if not sts:
            return {"error":"Subtopic not found"}
        return [s.to_dict() for s in sts], 200

    def post(self):
        data = request.get_json()
        try:
            s = Subtopic(
            name=data['name'],
            topic_id=data['topic_id'])
            db.session.add(s)
            db.session.commit()
        except Exception as e:
            return {'errors':[e.__str__()]},422
        return s.to_dict(), 201
api.add_resource(Subtopics, '/subtopics')

class SubtopicById(RestfulResource):
    def get(self, id):
        st = Subtopic.query.filter_by(id=id).first()
        if not st:
            return {"error":"Subtopic not found"}, 404
        return st.to_dict(), 200
    def patch(self, id):
        st = Subtopic.query.filter_by(id=id).first()
        if not st:
            return {"error":"Subtopic not found"}, 404
        data = request.get_json()
        for key in data.keys():
            setattr(st, key, data[key])
        db.session.add(st)
        db.session.commit()
        return st.to_dict(), 200
    def delete(self, id):
        st = Subtopic.query.filter_by(id=id).first()
        if not st:
            return {"error":"Subtopic not found"}, 404
        db.session.delete(st)
        db.session.commit()
        return {'':''}, 204

api.add_resource(SubtopicById, '/subtopics/<int:id>')

class Resources(RestfulResource):
    def get(self):
        rs = Resource.query.all()
        if not rs:
            return {"error":"Resource not found"}, 404
        return [r.to_dict() for r in rs], 200
    def post(self):
        data = request.get_json()
        try:
            r = Resource(type=data['type'],
            title=data['title'],
            url=data['url'],
            subtopic_id=data['subtopic_id']
            )
            db.session.add(r)
            db.session.commit()
        except Exception as e:
            return {"errors":[e.__str__()]}, 422
        return r.to_dict(), 201

api.add_resource(Resources, '/resources')

class ResourceById(RestfulResource):
    def get(self, id):
        r = Resource.query.filter_by(id=id).first()
        if not r:
            return {"error":"Resource not found"}, 404
        return r.to_dict(), 200
    
    def patch(self, id):
        r = Resource.query.filter_by(id=id).first()
        if not r:
            return {"error":"Resource not found"}, 404
        data = request.get_json()
        for key in data.keys():
            setattr(r, key, data[key])
        db.session.add(r)
        db.session.commit()
        return r.to_dict(), 200
    
    def delete(self, id):
        r = Resource.query.filter_by(id=id).first()
        if not r:
            return {"error":"Resource not found"}, 404
        db.session.delete(r)
        db.session.commit()
        return {'':''}, 204

api.add_resource(ResourceById, '/resources/<int:id>')

class Candidates(RestfulResource):
    def get(self):
        cs = Candidate.query.all()
        return [c.to_dict() for c in cs], 200
    
    def post(self):
        data = request.get_json()
        try:
            c = Candidate(name=data['name'], image_url=data['image_url'])
            db.session.add(c)
            db.session.commit()
        except Exception as e:
            return {"errors":[e.__str__()]}, 422
        return c.to_dict(), 201
        
api.add_resource(Candidates, '/candidates')

class CandidateById(RestfulResource):
    def get(self, id):
        c = Candidate.query.filter_by(id=id).first()
        if not c:
            return {"error":"Candidate not found"}, 404
        return c.to_dict(), 200
    
    def patch(self, id):
        c = Candidate.query.filter_by(id=id).first()
        if not c:
            return {"error":"Candidate not found"}, 404
        data = request.get_json()
        for key in data.keys():
            setattr(c, key, data[key])
        db.session.add(c)
        db.session.commit()
        return c.to_dict(), 200
    
    def delete(self, id):
        c = Candidate.query.filter_by(id=id).first()
        if not c:
            return {"error":"Candidate not found"}, 404
        db.session.delete(c)
        db.session.commit()
        return {'':''}, 204

api.add_resource(CandidateById, '/candidates/<int:id>')

class CandidateSubtopics(RestfulResource):
    def get(self):
        c_sts = CandidateSubtopic.query.all()
        return [cs.to_dict() for cs in c_sts], 200

    def post(self):
        data = request.get_json()
        try:
            cs = CandidateSubtopic(candidate_id=data['candidate_id'], subtopic_id=data['subtopic_id'])
            db.session.add(cs)
            db.session.commit()
        except Exception as e:
            return {"errors":[e.__str__()]}, 422
        return cs.to_dict(), 201

api.add_resource(CandidateSubtopics, '/candidate-subtopics')

class CandidateSubtopicById(RestfulResource):
    def get(self, id):
        cs = CandidateSubtopic.query.filter_by(id=id).first()
        if not cs:
            return {"error":"Subtopic Preference not found"}, 404
        return cs.to_dict(), 200
    
    def patch(self, id):
        cs = CandidateSubtopic.query.filter_by(id=id).first()
        if not cs:
            return {"error":"Candidate Subtopic not found"}, 404
        data = request.get_json()
        for key in data.keys():
            setattr(cs, key, data[key])
        db.session.add(cs)
        db.session.commit()
        return cs.to_dict(), 200
    
    def delete(self, id):
        cs = CandidateSubtopic.query.filter_by(id=id).first()
        if not cs:
            return {"error":"Candidate Subtopic not found"}, 404
        db.session.delete(cs)
        db.session.commit()
        return {'':''}, 204

api.add_resource(CandidateSubtopicById, '/candidate-subtopics/<int:id>')

class SubtopicPreferences(RestfulResource):
    def get(self):
        sps = UserSubtopicPreference.query.all()
        return [sp.to_dict() for sp in sps], 200

    def post(self):
        data = request.get_json()
        try:
            sp = UserSubtopicPreference(
            user_id=data['user_id'],
            subtopic_id=data['subtopic_id'],
            priority=data['priority']
            )
            db.session.add(sp)
            db.session.commit()
        except Exception as e:
            return {'errors':[e.__str__()]}, 422
        return sp.to_dict(), 201

api.add_resource(SubtopicPreferences, '/subtopic-preferences')

class SubtopicPreferenceById(RestfulResource):
    def get(self, id):
        sp = UserSubtopicPreference.query.filter_by(id=id).first()
        if not sp:
            return {"error":"Candidate Subtopic not found"}, 404
        return sp.to_dict(), 200
    
    def patch(self, id):
        sp = UserSubtopicPreference.query.filter_by(id=id).first()
        if not sp:
            return {"error":"Subtopic Preference not found"}, 404
        data = request.get_json()
        for key in data.keys():
            setattr(sp, key, data[key])
        db.session.add(sp)
        db.session.commit()
        return sp.to_dict(), 200
    
    def delete(self, id):
        sp = UserSubtopicPreference.query.filter_by(id=id).first()
        if not sp:
            return {"error":"Subtopic Preference not found"}, 404
        db.session.delete(sp)
        db.session.commit()
        return {'':''}, 204
api.add_resource(SubtopicPreferenceById, '/subtopic-preferences/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

