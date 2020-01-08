from flask import Blueprint, request, jsonify, Flask
from flask_cors import CORS, cross_origin
import json
import pymongo
import os
import sys
from pymongo import MongoClient
from bson import ObjectId

#app = Flask(__name__)
#CORS(app)
#cors = CORS(app, resources={r"/*"})

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
brewCollection = db["brew"]
inventoryCollection = db["inventory"]


#Blueprints
indexBrewRoute = Blueprint("indexBrew", __name__)
createBrewRoute = Blueprint("createBrew", __name__)
brewRoute = Blueprint("brew", __name__)
updateBrewRoute = Blueprint("updateBrew", __name__)
deleteBrewRoute = Blueprint("deleteBrew", __name__)

indexInventoryRoute = Blueprint("indexInventory", __name__)
createInventoryRoute = Blueprint("createInventory", __name__)

#routes 
@indexBrewRoute.route("/api/brew")
def indexBrew():
    brews = []

    retrieval = brewCollection.find({})

    for document in retrieval:
        brews.append({"_id": JSONEncoder().encode(document["_id"]), "productName":document["productName"]})
    return jsonify(data=brews)


# Route to handle individual brews
@indexBrewRoute.route("/api/brew/<id>", methods=["GET"])
def brews(id):
    # Find one object from mongo using the object id
    cursor = brewCollection.find_one({"_id":ObjectId(id)})
    #print(cursor, flush=True)

    # Prevemt serializable error being thrown
    return jsonify(data=JSONEncoder().encode(cursor))

# Route to handle creation of a brew
@createBrewRoute.route("/api/createbrew", methods=["POST"])
def createBrew():
    #print(request.json, flush=True)

    # Request all information and store in variables
    productName = request.json.get("productName")
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
    #print("Brew Name:" +productName +"Brew Number:" +brewNo + " Beer:" + beer + " batchNo:" + batchNo + " brewDate:" + brewDate + " og:" + og + " pg:" + pg + " abv:" + abv + " postConditionDate:" + postConditionDate + " postConditionVol:" + postConditionVol + " kegNo:" + kegNo + " bottleNo500:" + bottleNo500 + " bottleNo330:" + bottleNo330 + " duty:" + duty + " status:" + status)

    # create json format of data to send to MongoDB
    brew = {
        "productName": productName,
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
        "status": status
    }

    # Insert the brew into the mongoDB in mlabs, adapted from - https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/
    brewCollection.insert_one(brew)

    return jsonify(data="Brew created successfully")

# Update a brew 
@updateBrewRoute.route("/api/update/<id>", methods=["PUT"])
# Added cross origin to prevent blocking of requests
#@cross_origin(origin='localhost',headers=['Content-Type','Authorization']) 
def updateBrew(id):
    print("Updated Info")
    print(request.json, flush=True)
    
    # Request all information and store in variables
    productName = request.json.get("productName")
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
        "productName": productName,
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
        "status": status
    }

    # need to parse id so that mongo gets correct instance of id, otherwise will take it as invalid - {"_id": ObjectId(brewId)}
    # Set the contents of the id in mongo to the updated data above - {"$set": updatedBrew}
    brewCollection.update_one({"_id": ObjectId(brewId)}, {"$set": updatedBrew})

    response = jsonify(data = "update response")
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
    #return jsonify(data = "update response")   

@deleteBrewRoute.route("/api/delete/<id>", methods = ["DELETE"])
def delete(id):
    print(request.json, flush=True)
    brewId = request.json.get("id")
    brewCollection.remove({"_id": ObjectId(brewId)})

    return jsonify(data= "brew delete successfully") 

@indexInventoryRoute.route("/api/inventory")
def indexInventory():
    inventories = []

    retrieval = inventoryCollection.find({})

    for document in retrieval:
        inventories.append({"_id": JSONEncoder().encode(document["_id"]), "productName":document["productName"]})
    return jsonify(data=inventories)
# Route to handle creation of a brew
@createInventoryRoute.route("/api/createinventory", methods=["POST"])
def createInventory():
    #print(request.json, flush=True)

    # Request all information and store in variables
    productName = request.json.get("productName")
    totalLitres = request.json.get("totalLitres")
    totalCasesSold500Month = request.json.get("totalCasesSold500Month")
    remainingCases500 = request.json.get("remainingCases500")
    totalCasesSold330Month = request.json.get("totalCasesSold330Month")
    remainingCases330 = request.json.get("remainingCases330")
    totalKegsSold = request.json.get("totalKegsSold")
    remainingKegs = request.json.get("remainingKegs")
    openingStockCases = request.json.get("openingStockCases")
    openingStockKegs = request.json.get("openingStockKegs")
    receiptsCases = request.json.get("receiptsCases")
    receiptsKegs = request.json.get("receiptsKegs")

    # print variables to check if correct
    #print("Brew Name:" +productName +"total litres:" +totalLitres + " totalCasesSold500Month:" + totalCasesSold500Month + " remainingCases500:" + remainingCases500 + "totalCasesSold330Month:" + totalCasesSold330Month + " remainingCases330:" + remainingCases330 + " totalKegsSold:" + totalKegsSold + " remainingKegs:" + remainingKegs + " openingStockCases:" + openingStockCases + " openingStockKegs:" + openingStockKegs + " receiptsCases:" + receiptsCases + " receiptsKegs:" + receiptsKegs)

    # create json format of data to send to MongoDB
    inventory = {
        "productName": productName,
        "totalLitres": totalLitres,
        "totalCasesSold500Month": totalCasesSold500Month,
        "remainingCases500": remainingCases500,
        "totalCasesSold330Month": totalCasesSold330Month,
        "remainingCases330": remainingCases330,
        "totalKegsSold": totalKegsSold,
        "remainingKegs": remainingKegs,
        "openingStockCases": openingStockCases,
        "openingStockKegs": openingStockKegs,
        "receiptsCases": receiptsCases,
        "receiptsKegs": receiptsKegs
    }

    # Insert the brew into the mongoDB in mlabs, adapted from - https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/
    inventoryCollection.insert_one(inventory)

    return jsonify(data="inventory created successfully")
