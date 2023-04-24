from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData




metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)



# db.init_app(app)

class ApplicationConfig:
    SECRET_KEY = 'ksdfasdfjadsfadsf435befbwe8wdv2l34ui5yub'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'


