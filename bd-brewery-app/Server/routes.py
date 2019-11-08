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
collection = db["brew"]


#Blueprints
indexRoute = Blueprint("index", __name__)
createBrewRoute = Blueprint("createBrew", __name__)

#routes 
@indexRoute.route("/api/brew")
def index():
    return jsonify(data="Test")

@createBrewRoute.route("/api/createbrew", methods=["POST"])
def createBrew():
    print(request.json, flush=True)

    brewNo = request.json.get("brewNo")
    beer = request.json.get("beer")

    print("Brew Number:" +brewNo + " Beer:" + beer)

    brew = {
        "brewNo": brewNo,
        "beer": beer
    }

    collection.insert_one(brew)

    return jsonify(data="Brew created successfully")