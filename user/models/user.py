import os
from mongoengine import *

MONGO_URL = os.getenv('MONGO_URL') if os.getenv('MONGO_URL') else 'mongodb://localhost:27777/user-db'

connect(host=MONGO_URL)

class UserModel(Document):
    username = StringField(required=True, unique=True)
    password = StringField(required=True)

    meta = { 'collection': 'users' }