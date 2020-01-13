from flask import Blueprint, request, jsonify, Flask
from flask_cors import CORS, cross_origin
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
brewCollection = db["brew"]
inventoryCollection = db["inventory"]


#Blueprints
indexBrewRoute = Blueprint("indexBrew", __name__)
createBrewRoute = Blueprint("createBrew", __name__)
updateBrewRoute = Blueprint("updateBrew", __name__)
deleteBrewRoute = Blueprint("deleteBrew", __name__)
brewRoute = Blueprint("brewSingle", __name__)

indexInventoryRoute = Blueprint("indexInventory", __name__)
createInventoryRoute = Blueprint("createInventory", __name__)
updateInventoryRoute = Blueprint("updateInventory", __name__)
deleteInventoryRoute = Blueprint("deleteInventory", __name__)
inventoryRoute = Blueprint("inventorySingle", __name__)

#routes 
@indexBrewRoute.route("/api/brew")
def indexBrew():
    brews = []

    retrieval = brewCollection.find({})
    ss = brewCollection.find( { "productName": "Sheep Stealer" } )
    print(ss)
    for document in ss:
        print("productName" + document["productName"])

    for document in retrieval:
        brews.append({"_id": JSONEncoder().encode(document["_id"]), "productName":document["productName"]})
    return jsonify(data=brews)


# Route to handle individual brews
@brewRoute.route("/api/brew/<id>", methods=["GET"])
def brewSingle(id):
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
    postConditionDate = request.json.get("postConditionDate")
    kegNo = request.json.get("kegNo")
    bottleNo500 = request.json.get("bottleNo500")
    bottleNo330 = request.json.get("bottleNo330")
    status = request.json.get("status")

    ogSubtractpg = float(og) - float(pg)
    abv = calculateABV(ogSubtractpg)

    postConditionVol=""
    duty=""

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
@updateBrewRoute.route("/api/updateBrew/<id>", methods=["PUT"])
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
    postConditionDate = request.json.get("postConditionDate")
    kegNo = request.json.get("kegNo")
    bottleNo500 = request.json.get("bottleNo500")
    bottleNo330 = request.json.get("bottleNo330")
    status = request.json.get("status")

    ogSubtractpg = float(og) - float(pg)
    abv = calculateABV(ogSubtractpg)
    postConditionVol=""
    duty=""


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

@deleteBrewRoute.route("/api/deleteBrew/<id>", methods = ["DELETE"])
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
# Route to handle individual inventories
@indexInventoryRoute.route("/api/inventory/<id>", methods=["GET"])
def inventorySingle(id):
    # Find one object from mongo using the object id
    cursor = inventoryCollection.find_one({"_id":ObjectId(id)})
    #print(cursor, flush=True)

    # Prevemt serializable error being thrown
    return jsonify(data=JSONEncoder().encode(cursor))

# Route to handle creation of a Inventory
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
    #print("product Name:" +productName +"total litres:" +totalLitres + " totalCasesSold500Month:" + totalCasesSold500Month + " remainingCases500:" + remainingCases500 + "totalCasesSold330Month:" + totalCasesSold330Month + " remainingCases330:" + remainingCases330 + " totalKegsSold:" + totalKegsSold + " remainingKegs:" + remainingKegs + " openingStockCases:" + openingStockCases + " openingStockKegs:" + openingStockKegs + " receiptsCases:" + receiptsCases + " receiptsKegs:" + receiptsKegs)

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

    # Insert the Inventory into the mongoDB in mlabs, adapted from - https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/
    inventoryCollection.insert_one(inventory)

    return jsonify(data="inventory created successfully")
# Update an Inventory 
@updateInventoryRoute.route("/api/updateInventory/<id>", methods=["PUT"])
# Added cross origin to prevent blocking of requests
#@cross_origin(origin='localhost',headers=['Content-Type','Authorization']) 
def updateInventory(id):
    print("Updated Info")
    print(request.json, flush=True)
    
    # Request all information and store in variables
    productName = request.json.get("productName")
    inventoryId= request.json.get("inventoryId")
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

    # create json format of data to send to MongoDB
    updatedInventory = {
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

    # need to parse id so that mongo gets correct instance of id, otherwise will take it as invalid - {"_id": ObjectId(brewId)}
    # Set the contents of the id in mongo to the updated data above - {"$set": updatedBrew}
    inventoryCollection.update_one({"_id": ObjectId(inventoryId)}, {"$set": updatedInventory})

    response = jsonify(data = "update response")
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
    #return jsonify(data = "update response")   

@deleteInventoryRoute.route("/api/deleteInventory/<id>", methods = ["DELETE"])
def delete(id):
    print(request.json, flush=True)
    inventoryId = request.json.get("id")
    inventoryCollection.remove({"_id": ObjectId(inventoryId)})

    return jsonify(data= "inventory delete successfully") 




def calculateABV(ogSubtractpg):
    if (ogSubtractpg * 1000) < 6.9:
        abv = ogSubtractpg * 0.125
    elif (ogSubtractpg * 1000) < 10.4:
        abv = ogSubtractpg * 0.126
    elif (ogSubtractpg * 1000) < 17.2:
        abv = ogSubtractpg * 0.127
    elif (ogSubtractpg * 1000) < 26.1:
        abv = ogSubtractpg * 0.128
    elif (ogSubtractpg * 1000) < 36.0:
        abv = ogSubtractpg * 0.129
    elif (ogSubtractpg * 1000) < 46.5:
        abv = ogSubtractpg * 0.13
    elif (ogSubtractpg * 1000) < 57.1:
        abv = ogSubtractpg * 0.131
    elif (ogSubtractpg * 1000) < 67.9:
        abv = ogSubtractpg * 0.132  
    elif (ogSubtractpg * 1000) < 67.9:
        abv = ogSubtractpg * 0.132    
    elif (ogSubtractpg * 1000) < 67.9:
        abv = ogSubtractpg * 0.132
    else:
        # Not givem anymore calculations, so set 0 if above specified values
        abv = 0
    # Calculate abv as a percentage by muliplying value by 1000
    abv = abv * 1000
    # Return abv rounded to 2 decimal places
    return round(abv, 2)
