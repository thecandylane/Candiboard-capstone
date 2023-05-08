
from faker import Faker
from datetime import datetime
from models import User, Topic, Subtopic, Resource, Candidate, CandidateSubtopic, UserSubtopicPreference
from app import app
from config import db
from seedData import topics_data, candidates_data
import random

if __name__ == '__main__':
    fake = Faker()

with app.app_context():
    db.session.query(User).delete()
    db.session.query(UserSubtopicPreference).delete()
    db.session.query(CandidateSubtopic).delete()
    db.session.query(Candidate).delete()
    db.session.query(Resource).delete()
    db.session.query(Subtopic).delete()
    db.session.query(Topic).delete()

    # Create topics and subtopics
    TD = topics_data

    topics = []
    subtopics = []

    for topic_name, subtopic_list in TD.items():
        topic = Topic(name=topic_name)
        db.session.add(topic)
        topics.append(topic)

        for subtopic_data in subtopic_list:
            subtopic = Subtopic(name=subtopic_data['name'], description=subtopic_data['description'], topic=topic)
            db.session.add(subtopic)
            subtopics.append(subtopic)

            for resource_data in subtopic_data['resources']:
                resource = Resource(type=resource_data['type'], title=resource_data['title'],
                                    url=resource_data['url'], subtopic=subtopic)
                db.session.add(resource)



    CD = candidates_data

    candidates = []

    for candidate_data in CD:
        candidate = Candidate(name=candidate_data['name'], image_url=candidate_data['image_url'])
        db.session.add(candidate)
        candidates.append(candidate)

        for subtopic_name, weight in candidate_data['subtopics'].items():
            subtopic = next(s for s in subtopics if s.name == subtopic_name)
            candidate_subtopic = CandidateSubtopic(candidate=candidate, subtopic=subtopic, weight=weight)
            db.session.add(candidate_subtopic)
    
    num_users = 10
    max_preferences_per_user = 10

    for _ in range(num_users):
        user = User(username=fake.user_name(), email=fake.email(), password=fake.password(), admin=False)
        db.session.add(user)

        random_subtopics = random.sample(subtopics, min(max_preferences_per_user, len(subtopics)))

        for index, subtopic in enumerate(random_subtopics):
            user_subtopic_preference = UserSubtopicPreference(user=user, subtopic=subtopic, priority=index + 1)
            db.session.add(user_subtopic_preference)

    db.session.commit()
    print("Database seeded successfully!")
    