from flask import Blueprint, request, jsonify
import json
import pymongo
import os
import sys
from pymongo import MongoClient
from bson import ObjectId

# class to manage MongoDB ObjectId - as returns "object of type ObjectId is not serializable" without encoder
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
brewRoute = Blueprint("brew", __name__)
updateBrewRoute = Blueprint("updateBrew", __name__)

#routes 
@indexRoute.route("/api/brew")
def index():
    brews = []

    retrieval = collection.find({})

    for document in retrieval:
        brews.append({"_id": JSONEncoder().encode(document["_id"]), "brewNo":document["brewNo"], "beer":document["beer"]})
    return jsonify(data=brews)


# Route to handle individual brews
@indexRoute.route("/api/brew/<id>", methods=["GET"])
def brews(id):
    # Find one object from mongo using the object id
    cursor = collection.find_one({"_id":ObjectId(id)})
    print(cursor, flush=True)

    # Prevemt serializable error being thrown
    return jsonify(data=JSONEncoder().encode(cursor))

# Route to handle creation of a brew
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

# Update a brew
@updateBrewRoute.route("/api/update/<id>", methods=["PUT"])
def updateBrew(id):
    print(request.json, flush=True)
    
    # Request all information and store in variables
    brewId= request.json.get("brewId")
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


    # create json format of data to send to MongoDB
    updatedBrew = {
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

    # need to parse id so that mongo gets correct instance of id, otherwise will take it as invalid - {"_id": ObjectId(brewId)}
    # Set the contents of the id in mongo to the updated data above - {"$set": updatedBrew}
    collection.update_one({"_id": ObjectId(brewId)}, {"$set": updatedBrew})
    return jsonify(data = "update response")   