from flask import Blueprint, request, jsonify, Flask
from flask_cors import CORS, cross_origin
import json
import pymongo
import os
import sys
from pymongo import MongoClient
from bson import ObjectId
import calculations

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
stockReturnCollection = db["stockReturns"]


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

indexStockReturnRoute = Blueprint("indexStockReturn", __name__)
createStockReturnRoute = Blueprint("createStockReturn", __name__)
stockReturnRoute = Blueprint("stockReturnSingle", __name__)
deleteStockReturnRoute = Blueprint("deleteStockReturn", __name__)

#routes 
@indexBrewRoute.route("/api/brew")
def indexBrew():
    brews = []

    retrieval = brewCollection.find({})

    for document in retrieval:
        brews.append({"_id": JSONEncoder().encode(document["_id"]), "batchNo":document["batchNo"], "beer":document["beer"]})
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
    packaged = request.json.get("packaged")

    abv = calculations.calculateABV(og, pg)
    postConditionVol= calculations.calculatePCV(bottleNo330, bottleNo500, kegNo)
    duty= calculations.calculateDuty(postConditionVol,abv)

    # print variables to check if correct
    #print("Brew Name:" +"Brew Number:" +brewNo + " Beer:" + beer + " batchNo:" + batchNo + " brewDate:" + brewDate + " og:" + og + " pg:" + pg + " abv:" + abv + " postConditionDate:" + postConditionDate + " postConditionVol:" + postConditionVol + " kegNo:" + kegNo + " bottleNo500:" + bottleNo500 + " bottleNo330:" + bottleNo330 + " duty:" + duty + " status:" + status)

    # create json format of data to send to MongoDB
    brew = {
        "beer": beer,
        "batchNo": batchNo,
        "brewDate": brewDate,
        "og": og,
        "pg": pg,
        "ogMinusPg": round(float(og) - float(pg), 4),
        "abv": abv,
        "postConditionDate": postConditionDate,
        "postConditionVol": postConditionVol,
        "kegNo": kegNo,
        "bottleNo500": bottleNo500,
        "bottleNo330": bottleNo330,
        "duty": duty,
        "status": status,
        "packaged": packaged
    }

    # Insert the brew into the mongoDB in mlabs, adapted from - https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/
    brewCollection.insert_one(brew)

    return jsonify(data="Brew created successfully")

# Update a brew 
@updateBrewRoute.route("/api/updateBrew/<id>", methods=["PUT"])
# Added cross origin to prevent blocking of requests
#@cross_origin(origin='localhost',headers=['Content-Type','Authorization']) 
def updateBrew(id):
    #print("Updated Info")
    #print(request.json, flush=True)
    
    # Request all information and store in variables
    brewId= request.json.get("brewId")
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
    packaged = request.json.get("packaged")

    abv = calculations.calculateABV(og, pg)
    postConditionVol= calculations.calculatePCV(bottleNo330, bottleNo500, kegNo)
    duty= calculations.calculateDuty(postConditionVol,abv)


    # create json format of data to send to MongoDB
    updatedBrew = {
        "beer": beer,
        "batchNo": batchNo,
        "brewDate": brewDate,
        "og": og,
        "pg": pg,
        "ogMinusPg": round(float(og) - float(pg), 4),
        "abv": abv,
        "postConditionDate": postConditionDate,
        "postConditionVol": postConditionVol,
        "kegNo": kegNo,
        "bottleNo500": bottleNo500,
        "bottleNo330": bottleNo330,
        "duty": duty,
        "status": status,
        "packaged": packaged
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
        inventories.append({"_id": JSONEncoder().encode(document["_id"]), "batchNo":document["batchNo"], "beer":document["beer"]})
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
    # Request all information and store in variables
    batchNo = request.json.get("batchNo")
    beer = request.json.get("beer")
    totalCasesSold500Month = request.json.get("totalCasesSold500Month")
    remainingCases500 = request.json.get("remainingCases500")
    totalCasesSold330Month = request.json.get("totalCasesSold330Month")
    remainingCases330 = request.json.get("remainingCases330")
    totalKegsSoldMonth = request.json.get("totalKegsSold")
    remainingKegs = request.json.get("remainingKegs")
    openingStock330Cases = request.json.get("openingStock330Cases")
    openingStock500Cases = request.json.get("openingStock500Cases")
    openingStockKegs = request.json.get("openingStockKegs")
    openingStockPercentage = request.json.get("openingStockPercentage")

    calculationVariables = [batchNo, remainingCases500,remainingCases330, remainingKegs,totalCasesSold500Month,totalCasesSold330Month, totalKegsSoldMonth]

    invCalculations = calculations.inventoryCalculations(brewCollection, calculationVariables)

    # create json format of data to send to MongoDB
    inventory = {
        "batchNo": batchNo,
        "beer": beer,
        "totalLitres": invCalculations[7],
        "totalCasesSold500Month": totalCasesSold500Month,
        "remainingCases500": remainingCases500,
        "totalCasesSold330Month": totalCasesSold330Month,
        "remainingCases330": remainingCases330,
        "totalKegsSoldMonth": totalKegsSoldMonth,
        "remainingKegs": remainingKegs,
        "openingStock330Cases": openingStock330Cases,
        "openingStock500Cases": openingStock500Cases,
        "openingStockKegs": openingStockKegs,
        "openingStockPercentage": openingStockPercentage,
        "totalCasesSold500": invCalculations[0],
        "totalCasesSold330": invCalculations[1],
        "totalKegsSold": invCalculations[2],
        "remainingPCV": invCalculations[3],
        "receiptsAvg": invCalculations[4],
        "soldAvgMonth": invCalculations[5],
        "AvgRemaining": invCalculations[6]
    }

    # Insert the Inventory into the mongoDB in mlabs, adapted from - https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/
    inventoryCollection.insert_one(inventory)

    totalsInventory = calculations.calculateTotalUnits(brewCollection,inventoryCollection, beer, False)

    invRetrieval = inventoryCollection.find({})
    for document in invRetrieval:
        if batchNo == document["batchNo"]:
            id = document["_id"]

    inventoryCollection.update_one({"_id": ObjectId(id)}, {"$set":  {
        'totalsInventory': totalsInventory
    }})

    return jsonify(data="inventory created successfully")
# Update an Inventory 
@updateInventoryRoute.route("/api/updateInventory/<id>", methods=["PUT"])
# Added cross origin to prevent blocking of requests
#@cross_origin(origin='localhost',headers=['Content-Type','Authorization']) 
def updateInventory(id):
    #print("Updated Info")
    #print(request.json, flush=True)
    # Request all information and store in variables
    batchNo = request.json.get("batchNo")
    beer = request.json.get("beer")
    inventoryId= request.json.get("inventoryId")
    totalCasesSold500Month = request.json.get("totalCasesSold500Month")
    remainingCases500 = request.json.get("remainingCases500")
    totalCasesSold330Month = request.json.get("totalCasesSold330Month")
    remainingCases330 = request.json.get("remainingCases330")
    totalKegsSoldMonth = request.json.get("totalKegsSoldMonth")
    remainingKegs = request.json.get("remainingKegs")
    openingStock330Cases = request.json.get("openingStock330Cases")
    openingStock500Cases = request.json.get("openingStock500Cases")
    openingStockKegs = request.json.get("openingStockKegs")
    openingStockPercentage = request.json.get("openingStockPercentage")
    print(openingStockPercentage)

    calculationVariables = [batchNo, remainingCases500,remainingCases330, remainingKegs,totalCasesSold500Month,totalCasesSold330Month, totalKegsSoldMonth]

    invCalculations = calculations.inventoryCalculations(brewCollection,calculationVariables)

    # create json format of data to send to MongoDB
    updatedInventory = {
        "batchNo": batchNo,
        "beer": beer,
        "totalLitres": invCalculations[7],
        "totalCasesSold500Month": totalCasesSold500Month,
        "remainingCases500": remainingCases500,
        "totalCasesSold330Month": totalCasesSold330Month,
        "remainingCases330": remainingCases330,
        "totalKegsSoldMonth": totalKegsSoldMonth,
        "remainingKegs": remainingKegs,
        "openingStock330Cases": openingStock330Cases,
        "openingStock500Cases": openingStock500Cases,
        "openingStockKegs": openingStockKegs,
        "openingStockPercentage": openingStockPercentage,
        "totalCasesSold500": invCalculations[0],
        "totalCasesSold330": invCalculations[1],
        "totalKegsSold": invCalculations[2],
        "remainingPCV": invCalculations[3],
        "receiptsAvg": invCalculations[4],
        "soldAvgMonth": invCalculations[5],
        "AvgRemaining": invCalculations[6]
    }

    # need to parse id so that mongo gets correct instance of id, otherwise will take it as invalid - {"_id": ObjectId(inventoryId)}
    # Set the contents of the id in mongo to the updated data above - {"$set": updatedInventory}
    inventoryCollection.update_one({"_id": ObjectId(inventoryId)}, {"$set": updatedInventory})

    totalsInventory = calculations.calculateTotalUnits(brewCollection,inventoryCollection, beer, False)

    inventoryCollection.update_one({"_id": ObjectId(inventoryId)}, {"$set":  {
        'totalsInventory': totalsInventory
    }})

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

@indexStockReturnRoute.route("/api/stockreturn")
def indexStockReturn():
    stockReturn = []

    retrieval = stockReturnCollection.find({})

    for document in retrieval:
        stockReturn.append({"_id": JSONEncoder().encode(document["_id"]), "beer":document["beer"]})
    return jsonify(data=stockReturn)
# Route to handle individual stock returns
@indexStockReturnRoute.route("/api/stockreturn/<id>", methods=["GET"])
def stockReturnSingle(id):
    # Find one object from mongo using the object id
    cursor = stockReturnCollection.find_one({"_id":ObjectId(id)})
    #print(cursor, flush=True)

    # Prevemt serializable error being thrown
    return jsonify(data=JSONEncoder().encode(cursor))

# Route to handle creation of a stock return
@createStockReturnRoute.route("/api/createstockreturn", methods=["POST"])
def createStockReturn():
    # Request all information and store in variables
    beer = request.json.get("beer")
    otherBreweryCheckRec = request.json.get("otherBreweryCheckRec")
    otherCountryCheckRec = request.json.get("otherCountryCheckRec")
    otherBreweryCheckDel = request.json.get("otherBreweryCheckDel")
    otherCountryCheckDel = request.json.get("otherCountryCheckDel")

    totalsInventory = calculations.calculateTotalUnits(brewCollection,inventoryCollection, beer, True)

    totalCalculations = {
        "beer": beer,
        "otherBreweryCheckRec": otherBreweryCheckRec,
        "otherCountryCheckRec": otherCountryCheckRec,
        "otherBreweryCheckDel": otherBreweryCheckDel,
        "otherCountryCheckDel": otherCountryCheckDel,
        "totalsInventory": totalsInventory
    }

    stockReturnCollection.insert_one(totalCalculations)

    stockReturnRetrieval = stockReturnCollection.find({})
    totalStockReturnVals = calculations.calculateStockReturnTotalHL(stockReturnRetrieval)
    stockReturnRetrieval = stockReturnCollection.find({})
    for document in stockReturnRetrieval:
        id = document["_id"]
        stockReturnCollection.update_one({"_id": ObjectId(id)}, {"$set":  {
            'totalHLPercent': round(totalStockReturnVals[0], 2),
            'totalDutyOwed': round(totalStockReturnVals[1], 2)
        }})

    return jsonify(data="Stock Return created successfully")

@deleteStockReturnRoute.route("/api/deletestockreturn/<id>", methods = ["DELETE"])
def delete(id):
    print(request.json, flush=True)
    stockReturnId = request.json.get("id")
    stockReturnCollection.remove({"_id": ObjectId(stockReturnId)})

    return jsonify(data= "inventory delete successfully") 
    


