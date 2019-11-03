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
#- retrywrites needs to be set to default as not supported in enviornment - https://stackoverflow.com/questions/57836252/how-to-fix-retrywrites-in-mongo
connection = "mongodb://bdbrewery:bdbrewery1@ds241968.mlab.com:41968/bd_brewery?retryWrites=false"
# get a connecion with the database in mlab
client = MongoClient(connection)
# Connect to database by name
db = client["bd_brewery"]
# link to collection name in mlab
collection = db["brewcontrolsheet"]


#Blueprints
indexRoute = Blueprint("index", __name__)
createBCSRoute = Blueprint("createBCS", __name__)

#routes 
@indexRoute.route("/api/brewcontrolsheet")
def index():
    return jsonify(data="Test")

@createBCSRoute.route("/api/createbrewcontrolsheet", methods=["POST"])
def createBCS():
    print(request.json, flush=True)

    brewNo = request.json.get("brewNo")
    beer = request.json.get("beer")

    print("Brew Number:" +brewNo + " Beer:" + beer)

    brewcontrolsheet = {
        "brewNo": brewNo,
        "beer": beer
    }

    collection.insert_one(brewcontrolsheet)

    return jsonify(data="Brew Control sheet created successfully")