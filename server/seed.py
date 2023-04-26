from faker import Faker
from datetime import datetime
# from config import db, ApplicationConfig
from models import User, Topic, Subtopic, Resource, Candidate, CandidateSubtopic, UserSubtopicPreference
from app import app
from config import db


# app = Flask(__name__)
# app.config.from_object(ApplicationConfig)
if __name__ == '__main__':
    fake = Faker()

with app.app_context():
    db.session.query(UserSubtopicPreference).delete()
    db.session.query(CandidateSubtopic).delete()
    db.session.query(Resource).delete()
    db.session.query(Candidate).delete()
    db.session.query(User).delete()
    db.session.query(Subtopic).delete()
    db.session.query(Topic).delete()
    db.session.commit()

    topics = []
    subtopics = []

    for i in range(5):
        topic_name = fake.word()
        topic = Topic(name=topic_name)
        db.session.add(topic)
        topics.append(topic)

        for j in range(3):
            subtopic_name = fake.word()
            subtopic = Subtopic(name=subtopic_name, topic=topic)
            db.session.add(subtopic)
            subtopics.append(subtopic)

# create users
    users = []
    for i in range(10):
        username = fake.user_name()
        email = fake.email()
        password = fake.password()
        admin = fake.pybool()
        user = User(username=username, email=email, password=password, admin=admin)
        db.session.add(user)
        users.append(user)

# create resources
    resources = []
    for i in range(20):
        resource_type = fake.random_element(elements=('article', 'video', 'podcast'))
        resource_title = fake.sentence()
        resource_url = fake.url()
        subtopic = fake.random_element(elements=subtopics)
        resource = Resource(type=resource_type, title=resource_title, url=resource_url, subtopic=subtopic)
        db.session.add(resource)
        resources.append(resource)

# create candidates and candidate subtopics
    candidates = []
    candidate_subtopics = []

    for i in range(5):
        name = fake.name()
        image_url = fake.url()
        candidate = Candidate(name=name, image_url=image_url)
        db.session.add(candidate)
        candidates.append(candidate)

        for j in range(3):
            subtopic = fake.random_element(elements=subtopics)
            candidate_subtopic = CandidateSubtopic(candidate=candidate, subtopic=subtopic)
            db.session.add(candidate_subtopic)
            candidate_subtopics.append(candidate_subtopic)

# create user subtopic preferences
    user_subtopic_preferences = []
    for user in users:
        for subtopic in subtopics:
            priority = fake.random_int(min=1, max=5)
            user_subtopic_preference = UserSubtopicPreference(user=user, subtopic=subtopic, priority=priority)
            db.session.add(user_subtopic_preference)
            user_subtopic_preferences.append(user_subtopic_preference)

    db.session.commit()
    # delete previous data


# create topics and subtopics



