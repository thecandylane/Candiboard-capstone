from flask import Flask

from config import app, db, api
from models import db

api = Api(app)
app = Flask(__name__)
db.init_app( app )

if __name__ == '__main__':
    app.run(port=5555, debug=True)