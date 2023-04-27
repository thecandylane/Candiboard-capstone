from flask import Flask, request, make_response, jsonify
from flask_restful import Resource as RestfulResource, Api
from config import db, ApplicationConfig
from flask_migrate import Migrate 
from models import User, Topic, Subtopic, Resource, Candidate, CandidateSubtopic, UserSubtopicPreference
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta,datetime

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_jwt_extended import get_jwt
# from flask_jwt_extended import token_in_blocklist_loader

from functools import wraps



app = Flask(__name__)

CORS(app, origins=['http://localhost:3000'], supports_credentials=True)
app.config.from_object(ApplicationConfig)
# app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
jwt = JWTManager(app)
migrate = Migrate(app, db)
db.init_app( app )

api = Api(app)

BLACKLIST = set()

# ISSUES THAT MAY ARISE
'''
For the UserById, TopicById, SubtopicById, ResourceById, CandidateById, CandidateSubtopicById, and 
SubtopicPreferenceById classes, the get method should use public_id instead of id when filtering the
 query. This is because you are using identity=user.public_id in the access token creation in the login function.

 Continue to check with the admin_required wrappers in case i need to remove later
 
'''

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        jwt_data = get_jwt()
        is_admin = jwt_data.get("is_admin", False)
        if not is_admin:
            return jsonify({"message": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper

@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in BLACKLIST

#remember to fetch again when wanting to look at users subtopic_preferences, shit fuckin w me
@app.route('/whoami', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # if user:
    #     access_token = request.cookies.get('access_token')
    #     if access_token:
    #         return jsonify({
    #             'user': user.to_dict(),
    #             'access_token': access_token
    #         }), 200
    #     return jsonify({'message':'fuck nig'})
    # else:
    #     return jsonify({"message": "User not found", "user_id": user_id}), 422
    if user:
        return jsonify({
            'user': user.to_dict(),
            }), 200
    else:
        return jsonify({"message": "User not found", "user_id": user_id}), 422



'''
FOR EMAIL
'''
@app.route('/login', methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return make_response('could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    user = User.query.filter_by(email=email).first()

    if not user:
        return make_response('could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    if check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(minutes=1), additional_claims={"is_admin": user.admin})
        user_data = user.to_dict()
        user_data['access_token'] = access_token
        response = make_response(jsonify({'message': 'Logged in successfully', 'user': user_data}), 200)
        response.set_cookie('access_token', access_token, httponly=True, samesite='Lax', secure=False)
        return response
        
    return make_response('could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})


@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  # Get the unique identifier for the token
    BLACKLIST.add(jti)  # Add the token to the blacklist
    
    response = make_response(jsonify({"message": "Successfully logged out"}), 200)
    response.set_cookie('access_token', '', expires=0)  # Set the access_token to an empty string and expire it immediately

    return response


    '''
    old whoami
    '''
# @app.route('/whoami', methods=['GET'])
# @jwt_required()
# def get_current_user():
#     user_id = get_jwt_identity()
#     print(user_id)
#     user = User.query.get(user_id)

#     if user:
#         return jsonify(user.to_dict()), 200
#     else:
#         return jsonify({"message": "User not found", "user_id": user_id}), 422
'''
FOR USERNAME
'''
# @app.route('/login', methods=["POST"])
# def login():
#     auth = request.authorization
#     if not auth or not auth.username or not auth.password:
#         return make_response('could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

#     user = User.query.filter_by(username=auth.username).first()

#     if not user:
#         return make_response('could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

#     if check_password_hash(user.password, auth.password):
#         # access_token = create_access_token(identity=user.public_id, expires_delta=timedelta(minutes=30), additional_claims={"is_admin": user.admin})
#         access_token = create_access_token(identity=user.id, expires_delta=timedelta(minutes=30), additional_claims={"is_admin": user.admin})
#         '''why ?
#         '''

#         return jsonify({'token' : access_token})
#     return make_response('could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})



#Main model routes
class Users(RestfulResource):

    # @jwt_required()
    def get(self):
        users = User.query.all()
        return [u.to_dict() for u in users], 200

    # @jwt_required()
    # @admin_required
    def post(self):
        data = request.get_json()

        hashed_pass = generate_password_hash(data['password'], method='sha256')

        try:
            user = User(
            username=data['username'],
            email=data['email'],
            password=hashed_pass,
            admin=data['admin']
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

    @jwt_required()
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"error":"User not found"}, 404
        return user.to_dict(), 200

    @jwt_required()
    @admin_required
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

    @jwt_required()
    @admin_required
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"error":"User not found"}, 404
        db.session.delete(user)
        db.session.commit()
        return {'':''}, 204

api.add_resource(UserById, '/users/<int:id>')
    
class Topics(RestfulResource):

    @jwt_required()
    def get(self):
        topics = Topic.query.all()
        return [t.to_dict() for t in topics], 200

    @jwt_required()
    @admin_required
    def post(self):
        data = request.get_json()
        try:
            topic = Topic(name=data['name'])
            db.session.add(topic)
            db.session.commit()
        except Exception as e:
            return make_response({
                'errors':[e.__str__()]
            }, 422)
        return topic.to_dict(), 201

api.add_resource(Topics, '/topics')

class TopicById(RestfulResource):

    @jwt_required()
    def get(self, id):
        topic = Topic.query.filter_by(id=id).first()
        if not topic:
            return {"error":"Topic not found"}, 404
        return topic.to_dict(), 200

    @jwt_required()
    @admin_required
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

    @jwt_required()
    @admin_required
    def delete(self, id):
        topic = Topic.query.filter_by(id=id).first()
        if not topic:
            return {"error":"Topic not found"}, 404
        db.session.delete(topic)
        db.session.commit()
        return {'':''}, 204

api.add_resource(TopicById, '/topics/<int:id>')

class Subtopics(RestfulResource):

    @jwt_required()
    def get(self):
        sts = Subtopic.query.all()
        if not sts:
            return {"error":"Subtopic not found"}
        return [s.to_dict() for s in sts], 200

    @jwt_required()
    @admin_required
    def post(self):
        data = request.get_json()
        try:
            s = Subtopic(
            name=data['name'],
            topic_id=data['topic_id'])
            db.session.add(s)
            db.session.commit()
        except Exception as e:
            return make_response({
                'errors':[e.__str__()]
            }, 422)
        return s.to_dict(), 201
api.add_resource(Subtopics, '/subtopics')

class SubtopicById(RestfulResource):

    @jwt_required()
    def get(self, id):
        st = Subtopic.query.filter_by(id=id).first()
        if not st:
            return {"error":"Subtopic not found"}, 404
        return st.to_dict(), 200

    @jwt_required()
    @admin_required
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

    @jwt_required()
    @admin_required
    def delete(self, id):
        st = Subtopic.query.filter_by(id=id).first()
        if not st:
            return {"error":"Subtopic not found"}, 404
        db.session.delete(st)
        db.session.commit()
        return {'':''}, 204

api.add_resource(SubtopicById, '/subtopics/<int:id>')

class Resources(RestfulResource):
    
    @jwt_required()
    def get(self):
        rs = Resource.query.all()
        if not rs:
            return {"error":"Resource not found"}, 404
        return [r.to_dict() for r in rs], 200

    @jwt_required()
    @admin_required
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
            return make_response({
                'errors':[e.__str__()]
            }, 422)
        return r.to_dict(), 201

api.add_resource(Resources, '/resources')

class ResourceById(RestfulResource):

    @jwt_required()
    def get(self, id):
        r = Resource.query.filter_by(id=id).first()
        if not r:
            return {"error":"Resource not found"}, 404
        return r.to_dict(), 200

    @jwt_required()
    @admin_required
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

    @jwt_required()
    @admin_required
    def delete(self, id):
        r = Resource.query.filter_by(id=id).first()
        if not r:
            return {"error":"Resource not found"}, 404
        db.session.delete(r)
        db.session.commit()
        return {'':''}, 204

api.add_resource(ResourceById, '/resources/<int:id>')

class Candidates(RestfulResource):
    
    @jwt_required()
    def get(self):
        cs = Candidate.query.all()
        return [c.to_dict() for c in cs], 200

    @jwt_required()
    @admin_required
    def post(self):
        data = request.get_json()
        try:
            c = Candidate(name=data['name'], image_url=data['image_url'])
            db.session.add(c)
            db.session.commit()
        except Exception as e:
            return make_response({
                'errors':[e.__str__()]
            }, 422)
        return c.to_dict(), 201
        
api.add_resource(Candidates, '/candidates')

class CandidateById(RestfulResource):

    @jwt_required()
    def get(self, id):
        c = Candidate.query.filter_by(id=id).first()
        if not c:
            return {"error":"Candidate not found"}, 404
        return c.to_dict(), 200

    @jwt_required()
    @admin_required
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

    @jwt_required()
    @admin_required
    def delete(self, id):
        c = Candidate.query.filter_by(id=id).first()
        if not c:
            return {"error":"Candidate not found"}, 404
        db.session.delete(c)
        db.session.commit()
        return {'':''}, 204

api.add_resource(CandidateById, '/candidates/<int:id>')

class CandidateSubtopics(RestfulResource):

    @jwt_required()
    def get(self):
        c_sts = CandidateSubtopic.query.all()
        return [cs.to_dict() for cs in c_sts], 200

    @jwt_required()
    @admin_required
    def post(self):
        data = request.get_json()
        try:
            cs = CandidateSubtopic(candidate_id=data['candidate_id'], subtopic_id=data['subtopic_id'])
            db.session.add(cs)
            db.session.commit()
        except Exception as e:
            return make_response({
                'errors':[e.__str__()]
            }, 422)
        return cs.to_dict(), 201

api.add_resource(CandidateSubtopics, '/candidate-subtopics')

class CandidateSubtopicById(RestfulResource):

    @jwt_required()
    def get(self, id):
        cs = CandidateSubtopic.query.filter_by(id=id).first()
        if not cs:
            return {"error":"Subtopic Preference not found"}, 404
        return cs.to_dict(), 200
        
    @jwt_required()
    @admin_required
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

    @jwt_required()
    @admin_required
    def delete(self, id):
        cs = CandidateSubtopic.query.filter_by(id=id).first()
        if not cs:
            return {"error":"Candidate Subtopic not found"}, 404
        db.session.delete(cs)
        db.session.commit()
        return {'':''}, 204

api.add_resource(CandidateSubtopicById, '/candidate-subtopics/<int:id>')

def add_subtopic_preference(user_id, subtopic_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return {"error": "User not found"}, 404

    sp = UserSubtopicPreference(
        user_id=user_id,
        subtopic_id=subtopic_id,
        priority=len(user.subtopic_preferences) + 1
    )
    db.session.add(sp)
    db.session.commit()

    return sp.to_dict(), 201

class SubtopicPreferences(RestfulResource):

    @jwt_required()
    def get(self):
        sps = UserSubtopicPreference.query.all()
        return [sp.to_dict() for sp in sps], 200

    @jwt_required()
    # @admin_required
    # def post(self):
    #     data = request.get_json()
    #     try:
    #         sp = UserSubtopicPreference(
    #         user_id=data['user_id'],
    #         subtopic_id=data['subtopic_id'],
    #         priority=data['priority']
    #         )
    #         db.session.add(sp)
    #         db.session.commit()
    #     except Exception as e:
    #         return make_response({
    #             'errors':[e.__str__()]
    #         }, 422)
    #     return sp.to_dict(), 201
    def post(self):
        print(request.get_json())
        data = request.get_json()
        user_id = data['user_id']
        subtopic_id = data['subtopic_id']
        return add_subtopic_preference(user_id, subtopic_id)

api.add_resource(SubtopicPreferences, '/subtopic-preferences')

class SubtopicPreferenceById(RestfulResource):

    @jwt_required()
    def get(self, id):
        sp = UserSubtopicPreference.query.filter_by(id=id).first()
        if not sp:
            return {"error":"Candidate Subtopic not found"}, 404
        return sp.to_dict(), 200

    @jwt_required()
    # @admin_required
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

    @jwt_required()
    # @admin_required
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




# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         token = None

#         if 'x-access-token' in request.headers:
#             token = request.headers['x-access-token']
        
#         if not token:
#             return jsonify({'message': 'token is missing'}), 401
        
#         try:
#             data = jwt.

#Authentication and Authorization
# @app.route("/token", methods=["POST"])
# def create_token():
#     email = request.json.get("email", None)
#     password = request.json.get("password", None)
#     if email != "test@test.com" or password != "test":
#         return jsonify({"msg": "Bad username or password"}), 401

#     access_token = create_access_token(identity=email)
#     return jsonify(access_token=access_token)
