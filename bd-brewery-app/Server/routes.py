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
totalCollection = db["totals"]


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
    #print(ss)
    #for document in ss:
        #print("productName" + document["productName"])

    for document in retrieval:
        brews.append({"_id": JSONEncoder().encode(document["_id"]), "batchNo":document["batchNo"]})
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

    abv = calculateABV(og, pg)
    postConditionVol=calculatePCV(bottleNo330, bottleNo500, kegNo)
    duty=calculateDuty(postConditionVol,abv)

    # print variables to check if correct
    #print("Brew Name:" +productName +"Brew Number:" +brewNo + " Beer:" + beer + " batchNo:" + batchNo + " brewDate:" + brewDate + " og:" + og + " pg:" + pg + " abv:" + abv + " postConditionDate:" + postConditionDate + " postConditionVol:" + postConditionVol + " kegNo:" + kegNo + " bottleNo500:" + bottleNo500 + " bottleNo330:" + bottleNo330 + " duty:" + duty + " status:" + status)

    # create json format of data to send to MongoDB
    brew = {
        "productName": productName,
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
    productName = request.json.get("productName")
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

    abv = calculateABV(og, pg)
    postConditionVol=calculatePCV(bottleNo330, bottleNo500, kegNo)
    duty=calculateDuty(postConditionVol,abv)


    # create json format of data to send to MongoDB
    updatedBrew = {
        "productName": productName,
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
        inventories.append({"_id": JSONEncoder().encode(document["_id"]), "batchNo":document["batchNo"]})
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
    totalCasesSold500 = ""
    totalCasesSold330 = ""
    totalKegsSold = ""
    receiptsAvg = ""
    soldAvgMonth = ""
    AvgRemaining =""
    # Request all information and store in variables
    batchNo = request.json.get("batchNo")
    totalCasesSold500Month = request.json.get("totalCasesSold500Month")
    remainingCases500 = request.json.get("remainingCases500")
    totalCasesSold330Month = request.json.get("totalCasesSold330Month")
    remainingCases330 = request.json.get("remainingCases330")
    totalKegsSoldMonth = request.json.get("totalKegsSold")
    remainingKegs = request.json.get("remainingKegs")
    openingStock330Cases = request.json.get("openingStock330Cases")
    openingStock500Cases = request.json.get("openingStock500Cases")
    openingStockKegs = request.json.get("openingStockKegs")
    receipts500Cases = request.json.get("receipts500Cases")
    receipts330Cases = request.json.get("receipts330Cases")
    receiptsKegs = request.json.get("receiptsKegs")

    calculationVariables = [batchNo, remainingCases500,remainingCases330, remainingKegs,totalCasesSold500Month,totalCasesSold330Month, totalKegsSoldMonth]

    invCalculations = inventoryCalculations(calculationVariables)

    # create json format of data to send to MongoDB
    inventory = {
        "batchNo": batchNo,
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
        "receiptsCases500": receiptsCases500,
        "receiptsCases330": receiptsCases330,
        "receiptsKegs": receiptsKegs,
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
    receiptsCases500 = request.json.get("receipts500Cases")
    receiptsCases330 = request.json.get("receipts330Cases")
    receiptsKegs = request.json.get("receiptsKegs")

    calculationVariables = [batchNo, remainingCases500,remainingCases330, remainingKegs,totalCasesSold500Month,totalCasesSold330Month, totalKegsSoldMonth]

    invCalculations = inventoryCalculations(calculationVariables)

    # create json format of data to send to MongoDB
    updatedInventory = {
        "batchNo": batchNo,
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
        "receiptsCases500": receiptsCases500,
        "receiptsCases330": receiptsCases330,
        "receiptsKegs": receiptsKegs,
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
    totalsInventory = calculateTotalUnits()

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



def calculateABV(og, pg):
    ogSubtractpg = float(og) - float(pg)
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

def calculatePCV(bottle330, bottle500, kegs):
    bottleNum330 = int(bottle330)
    bottleNum500 = int(bottle500)
    kegNum = int(kegs)
    postConditionVolume = (bottleNum330 * 7.92) + (bottleNum500 * 6) + (kegNum * 30)
    return round(postConditionVolume, 2)

def calculateDuty(postConditionVolume , abv):
    duty = (postConditionVolume/100 * abv * 22.5)/2
    return round(duty, 2)

def calculateTotalUnits():
    #retrieval = inventoryCollection.find({},{ "receiptsAvg": 1, "_id": 0 })
    retrieval = inventoryCollection.find({})
    totalReceiptsAvg = 0.0
    totalSoldMonthAvg = 0.0
    totalAvgRemaining = 0.0
    totalMonthlyCases500Sold = 0.0
    total500CasesSold = 0.0
    totalRemainingCases500 = 0.0
    totalMonthlyCases330Sold = 0.0
    total330CasesSold = 0.0
    totalRemainingCases330 = 0.0
    totalMonthlyKegsSold = 0.0
    totalInvKegsSold = 0.0
    totalRemainingKegs = 0.0
    averageReceiptsDivisial = 0.0
    totalReceiptsCases500 = 0.0
    totalReceiptsCases330 = 0.0
    totalReceiptsKegs = 0.0

    for document in retrieval: 
        #Total 500 Calculations
        totalCasesSold500Month = document["totalCasesSold500Month"]
        totalCasesSold500 = document["totalCasesSold500"]
        remainingCases500 = document["remainingCases500"]

        totalMonthlyCases500Sold += totalMonthlyCases500Sold + float(totalCasesSold500Month)
        total500CasesSold += total500CasesSold + float(totalCasesSold500)
        totalRemainingCases500 += totalRemainingCases500 + float(remainingCases500)

        # Total 330 Calculations
        totalCasesSold330Month = document["totalCasesSold330Month"]
        totalCasesSold330 = document["totalCasesSold330"]
        remainingCases330 = document["remainingCases330"]

        totalMonthlyCases330Sold += totalMonthlyCases330Sold + float(totalCasesSold330Month)
        total330CasesSold += total330CasesSold + float(total330CasesSold)
        totalRemainingCases330 += totalRemainingCases330 + float(remainingCases330)

        # Total Keg Calculations
        totalKegsSoldMonth = document["totalKegsSoldMonth"]
        totalKegsSold = document["totalKegsSold"]
        remainingKegs = document["remainingKegs"]
        
        totalMonthlyKegsSold += totalMonthlyKegsSold + float(totalKegsSoldMonth)
        totalInvKegsSold += totalInvKegsSold + float(totalKegsSold)
        totalRemainingKegs += totalRemainingKegs + float(remainingKegs)

        receiptsAvg = document["receiptsAvg"]
        soldAvgMonth = document["soldAvgMonth"]
        AvgRemaining = document["AvgRemaining"]

        totalReceiptsAvg += receiptsAvg
        #print("totalReceiptsAvg per inv "+ str(totalReceiptsAvg))
        totalSoldMonthAvg += totalSoldMonthAvg + soldAvgMonth
        totalAvgRemaining += totalAvgRemaining + AvgRemaining

        totalLitres = document["totalLitres"]

        # Deliveries calculations
        deliveries330Cases = (int(document["openingStock330Cases"]) + totalReceiptsCases330) - int(document["remainingCases330"])
        deliveries500Cases = (int(document["openingStock500Cases"]) + totalReceiptsCases500) - int(document["remainingCases500"])
        deliveriesKegs = (int(document["openingStockKegs"]) + totalReceiptsKegs) - int(document["remainingKegs"])
        #print("deliveries330Cases "+str(deliveries330Cases)+" deliveries500Cases"+str(deliveries500Cases)+" deliveriesKegs"+str(deliveriesKegs))#

        # Calculate HL for Opening Stock, Receipts, Deliveries and Closing Stock
        OS_HL = calculatePCV(document["openingStock330Cases"] ,document["openingStock500Cases"], document["openingStockKegs"] ) / 100
        receipts_HL = calculatePCV(totalReceiptsCases330 ,totalReceiptsCases500, totalReceiptsKegs ) / 100
        deliveries_HL = calculatePCV(deliveries500Cases ,deliveries330Cases, deliveriesKegs ) / 100
        CS_HL = float(document["remainingPCV"]) / 100

        print(receiptsAvg)
        if float(receiptsAvg) > 0.0:
            averageReceiptsDivisial += totalLitres
            brewDetails = brewCollection.find( { "batchNo": document["batchNo"] } )
            for document in brewDetails:
                totalReceiptsCases500 += float(document["bottleNo500"])
                totalReceiptsCases330 += float(document["bottleNo330"])
                totalReceiptsKegs += float(document["kegNo"])

    totalMonthlyCases500SoldTL = totalMonthlyCases500Sold * 6
    total500CasesSoldTL = total500CasesSold * 6
    totalRemainingCases500TL = totalRemainingCases500 * 6
    totalMonthlyCases330SoldTL = totalMonthlyCases330Sold * 6
    total330CasesSoldTL = total330CasesSold * 6
    totalRemainingCases330TL = totalRemainingCases330 * 6
    totalMonthlyKegsSoldTL = totalMonthlyKegsSold * 6
    totalInvKegsSoldTL = totalInvKegsSold * 6
    totalRemainingKegsTL = totalRemainingKegs * 6

    print("totalReceiptsAvg "+ str(totalReceiptsAvg))

    if averageReceiptsDivisial != 0:
        receiptsAvgNewPercentage = round(totalReceiptsAvg / averageReceiptsDivisial, 2)
        print("averageReceiptsDivisial "+ str(averageReceiptsDivisial))
        print("receiptsAvgNewPercentage "+ str(receiptsAvgNewPercentage))
    
    # Same as Receipts - %
    soldMonthAvgNewPercentage = totalSoldMonthAvg / (totalMonthlyCases500SoldTL + totalMonthlyCases330SoldTL + totalMonthlyKegsSoldTL)
    # Same as Receipts - %
    remainsAvgNewPercentage = totalAvgRemaining / (totalRemainingCases500TL + totalRemainingCases330TL + totalRemainingKegsTL)
    
    litresSold = total500CasesSoldTL + total330CasesSoldTL + totalInvKegsSoldTL
    HLSold = litresSold / 100

    receipts_HLPercent  = receipts_HL * receiptsAvgNewPercentage
    Deliveries_HLPercent = deliveries_HL * soldMonthAvgNewPercentage
    CS_HLPercent = CS_HL * remainsAvgNewPercentage


    totalsInventory = {
        "totalMonthlyCases500Sold": totalMonthlyCases500Sold,
        "total500CasesSold": total500CasesSold,
        "totalRemainingCases500": totalRemainingCases500,
        "totalMonthlyCases330Sold": totalMonthlyCases330Sold,
        "totalCasesSold330Month": totalCasesSold330Month,
        "total330CasesSold": total330CasesSold,
        "totalRemainingCases330": totalRemainingCases330,
        "totalMonthlyKegsSold": totalMonthlyKegsSold,
        "totalInvKegsSold": totalInvKegsSold,
        "totalRemainingKegs": totalRemainingKegs,
        "totalReceiptsAvg": totalReceiptsAvg,
        "totalSoldMonthAvg": totalSoldMonthAvg,
        "totalAvgRemaining": totalAvgRemaining,
        "totalMonthlyCases500SoldTL": totalMonthlyCases500SoldTL,
        "total500CasesSoldTL": total500CasesSoldTL,
        "totalRemainingCases500TL": totalRemainingCases500TL,
        "totalMonthlyCases330SoldTL": totalMonthlyCases330SoldTL,
        "total330CasesSoldTL": total330CasesSoldTL,
        "totalRemainingCases330TL": totalRemainingCases330TL,
        "totalMonthlyKegsSoldTL": totalMonthlyKegsSoldTL,
        "totalInvKegsSoldTL": totalInvKegsSoldTL,
        "totalRemainingKegsTL": totalRemainingKegsTL,
        "receiptsAvgNewPercentage": receiptsAvgNewPercentage,
        "soldMonthAvgNewPercentage": soldMonthAvgNewPercentage,
        "remainsAvgNewPercentage": remainsAvgNewPercentage,
        "litresSold": litresSold,
        "HLSold": HLSold
    }
    
    return totalsInventory

def inventoryCalculations(calculationVariables):
    brewDetails = brewCollection.find( { "batchNo": calculationVariables[0] } )
    for document in brewDetails:
        print("batchNo brew" + document["batchNo"])
        total500cases = document["bottleNo500"]
        total330cases = document["bottleNo330"]
        totalkegs = document["kegNo"]
        totalCasesSold500 = int(total500cases) - int(calculationVariables[1])
        totalCasesSold330 = int(total330cases) - int(calculationVariables[2])
        totalKegsSold = int(totalkegs) - int(calculationVariables[3])

        abv = document["abv"]
        pcv = document["postConditionVol"]
        totalLitres = pcv

        packagedBatch = document["packaged"]

        if packagedBatch:
            receiptsAvg = round(float(pcv) * float(abv) , 2)
        
        else:
            receiptsAvg = 0.0

        monthPCV = calculatePCV(calculationVariables[4] ,calculationVariables[5], calculationVariables[6] )
        soldAvgMonth = float(monthPCV) * float(abv)

        remainingPCV = calculatePCV(calculationVariables[1] ,calculationVariables[2], calculationVariables[3] )
        AvgRemaining= float(remainingPCV) * float(abv)
    # create json format of data to send to MongoDB
    invCalculations = [
        totalCasesSold500,
        totalCasesSold330,
        totalKegsSold,
        remainingPCV,
        receiptsAvg,
        soldAvgMonth,
        AvgRemaining,
        totalLitres
    ]
    return invCalculations

def calculateStockReturn(deliveries):
    return deliveries
    


