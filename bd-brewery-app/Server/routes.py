from flask import Blueprint, request, jsonify
import json
import pymongo
import os
import sys
from pymongo import MongoClient
from bson import ObjectId

# class to manage MongoDB id
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self,o)

# Configure MongoDB with mlab connection

# Set up connection with user and password of database
connection = "mongodb://bdbrewery:bdbrewery1@ds241968.mlab.com:41968/bd_brewery"
# get a connecion with the database in mlab
client = MongoClient(connection)
# Connect to database by name
db = client["bd_brewery"]
# link to collection name in mlab
collection = db["brewcontrolsheet"]


#Blueprints
indexRoute = Blueprint("index", __name__)

#routes 
@indexRoute.route("/api/brewcontrolsheet")
def index():
    return jsonify(data="Test")