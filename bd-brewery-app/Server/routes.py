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

    # Request all information and store in variables
    brewNo = request.json.get("brewNo")
    beer = request.json.get("beer")
    batchNo = request.json.get("batchNo")
    brewDate = request.json.get("brewDate")
    og = request.json.get("og")
    pg = request.json.get("pg")
    abv = request.json.get("abv")
    postConditionDate = request.json.get("postConditionDate")
    postConditionVol = request.json.get("postConditionVol")
    kegNo = request.json.get("kegNo")
    bottleNo500 = request.json.get("bottleNo500")
    bottleNo330 = request.json.get("bottleNo330")
    duty = request.json.get("duty")
    status = request.json.get("status")

    # print variables to check if correct
    print("Brew Number:" +brewNo + " Beer:" + beer + " batchNo:" + batchNo + " brewDate:" + brewDate + " og:" + og + " pg:" + pg + " abv:" + abv + " postConditionDate:" + postConditionDate + " postConditionVol:" + postConditionVol + " kegNo:" + kegNo + " bottleNo500:" + bottleNo500 + " bottleNo330:" + bottleNo330 + " duty:" + duty + " status:" + status)

    # create json format of data to send to MongoDB
    brew = {
        "brewNo": brewNo,
        "beer": beer,
        "batchNo": batchNo,
        "brewDate": brewDate,
        "og": og,
        "pg": pg,
        "abv": abv,
        "postConditionDate": postConditionDate,
        "postConditionVol": postConditionVol,
        "kegNo": kegNo,
        "bottleNo500": bottleNo500,
        "bottleNo330": bottleNo330,
        "duty": duty,
        "status": status,
        "beer": beer
    }

    # Insert the brew into the mongoDB in mlabs, adapted from - https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/
    collection.insert_one(brew)

    return jsonify(data="Brew created successfully")