import calculations
import json
import pymongo
from pymongo import MongoClient
import env

# Configure MongoDB with mlab connection
# Set up connection with user and password of database 
#- retrywrites needs to be set to default as not supported in enviornment - https://stackoverflow.com/questions/57836252/how-to-fix-retrywrites-in-mongo
connection = "mongodb://"+env.TEST_USER+":"+env.TEST_PASSWORD+"@ds341605.mlab.com:41605/"+env.TEST_DB+"?retryWrites=false"
# get a connecion with the database in mlab
client = MongoClient(connection)
# Connect to database by name
db = client[env.TEST_DB]
# link to collection name in mlab
brewCollection = db["brew"]
inventoryCollection = db["inventory"]
stockReturnCollection = db["stockReturns"]

# Populate test brews
def populateBrews():
    brew1 = {
        "beer": "Sheep Stealer",
        "batchNo": "SS00719",
        "brewDate": "05-03-2020",
        "og": "1.0440",
        "pg": "1.0018",
        "abv": 5.49,
        "postConditionDate": "07/08/19",
        "postConditionVol": 966,
        "kegNo": "0",
        "bottleNo500": "161",
        "bottleNo330": "0",
        "duty": 596.63,
        "status": "Mixed",
        "packaged": "true",
        "ogMinusPg": 0.0422
    }

    brew2 = {
        "beer": "Sheep Stealer",
        "batchNo": "SS00619",
        "brewDate": "03-03-2020",
        "og": "1.0440",
        "pg": "1.0010",
        "abv": 5.59,
        "postConditionDate": "19/08/19",
        "postConditionVol": 990,
        "kegNo": "33",
        "bottleNo500": "0",
        "bottleNo330": "0",
        "duty": 622.59,
        "status": "Mixed",
        "packaged": "true",
        "ogMinusPg": 0.043
    }

    brewCollection.insert_one(brew1)
    brewCollection.insert_one(brew2)

# Populate test inventories
def populateInventories():
    inv1 = {
        "batchNo": "SS00619",
        "beer": "Sheep Stealer",
        "totalLitres": 990,
        "totalCasesSold500Month": "0",
        "remainingCases500": "0",
        "totalCasesSold330Month": "0",
        "remainingCases330": "0",
        "totalKegsSoldMonth": "6",
        "remainingKegs": "27",
        "openingStock330Cases": "16",
        "openingStock500Cases": "50",
        "openingStockKegs": "7",
        "openingStockPercentage": "5.62",
        "totalCasesSold500": 0,
        "totalCasesSold330": 0,
        "totalKegsSold": 6,
        "remainingPCV": 810,
        "receiptsAvg": 5534.1,
        "soldAvgMonth": 1006.2,
        "AvgRemaining": 4527.9,
        "totalsInventory": {
            "totalMonthlyCases500Sold": 0,
            "total500CasesSold": 0,
            "totalRemainingCases500": 0,
            "totalMonthlyCases330Sold": 0,
            "totalCasesSold330Month": "0",
            "total330CasesSold": 0,
            "totalRemainingCases330": 0,
            "totalMonthlyKegsSold": 6,
            "totalInvKegsSold": 6,
            "totalRemainingKegs": 27,
            "totalReceiptsAvg": 5534.1,
            "totalSoldMonthAvg": 1006.2,
            "totalAvgRemaining": 4527.9,
            "totalMonthlyCases500SoldTL": 0,
            "total500CasesSoldTL": 0,
            "totalRemainingCases500TL": 0,
            "totalMonthlyCases330SoldTL": 0,
            "total330CasesSoldTL": 0,
            "totalRemainingCases330TL": 0,
            "totalMonthlyKegsSoldTL": 180,
            "totalInvKegsSoldTL": 180,
            "totalRemainingKegsTL": 810,
            "receiptsAvgNewPercentage": 5.59,
            "soldMonthAvgNewPercentage": 5.59,
            "remainsAvgNewPercentage": 5.59,
            "litresSold": 180,
            "HLSold": 1.8
        },
        "brewDate": "03-03-2020"
    }

    inv2 = {
        "batchNo": "SS00719",
        "beer": "Sheep Stealer",
        "totalLitres": 966,
        "totalCasesSold500Month": "4",
        "remainingCases500": "157",
        "totalCasesSold330Month": "0",
        "remainingCases330": "0",
        "totalKegsSoldMonth": "0",
        "remainingKegs": "0",
        "openingStock330Cases": "16",
        "openingStock500Cases": "50",
        "openingStockKegs": "7",
        "openingStockPercentage": "5.62",
        "totalCasesSold500": 4,
        "totalCasesSold330": 0,
        "totalKegsSold": 0,
        "remainingPCV": 942,
        "receiptsAvg": 5303.34,
        "soldAvgMonth": 131.76,
        "AvgRemaining": 5171.58,
        "totalsInventory": {
            "totalMonthlyCases500Sold": 4,
            "total500CasesSold": 4,
            "totalRemainingCases500": 157,
            "totalMonthlyCases330Sold": 0,
            "totalCasesSold330Month": "0",
            "total330CasesSold": 0,
            "totalRemainingCases330": 0,
            "totalMonthlyKegsSold": 6,
            "totalInvKegsSold": 6,
            "totalRemainingKegs": 27,
            "totalReceiptsAvg": 10837.44,
            "totalSoldMonthAvg": 1137.96,
            "totalAvgRemaining": 9699.48,
            "totalMonthlyCases500SoldTL": 24,
            "total500CasesSoldTL": 24,
            "totalRemainingCases500TL": 942,
            "totalMonthlyCases330SoldTL": 0,
            "total330CasesSoldTL": 0,
            "totalRemainingCases330TL": 0,
            "totalMonthlyKegsSoldTL": 180,
            "totalInvKegsSoldTL": 180,
            "totalRemainingKegsTL": 810,
            "receiptsAvgNewPercentage": 5.54,
            "soldMonthAvgNewPercentage": 5.58,
            "remainsAvgNewPercentage": 5.54,
            "litresSold": 204,
            "HLSold": 2.04
        },
        "brewDate": "05-03-2020"
    }

    inventoryCollection.insert_one(inv1)
    inventoryCollection.insert_one(inv2)

# Populate test inventories
def populateStockReturns():
    stockreturn1 = {
        "beer": "Sheep Stealer",
        "otherBreweryCheckRec": "false",
        "otherCountryCheckRec": "false",
        "otherBreweryCheckDel": "false",
        "otherCountryCheckDel": "false",
        "totalsInventory": {
            "openingStock330Cases": "16",
            "openingStock500Cases": "50",
            "openingStockKegs": "7",
            "recieptsCases330": 0,
            "recieptsCases500": 161,
            "recieptsKegs": 33,
            "deliveries330Cases": 16,
            "deliveries500Cases": 54,
            "deliveriesKegs": 13,
            "closingStockCases330": 0,
            "closingStockCases500": 157,
            "closingStockKegs": 27,
            "OS_HL": 6.37,
            "receipts_HL": 19.56,
            "deliveries_HL": 8.41,
            "CS_HL": 17.52,
            "openingStockPercentage": "5.62",
            "receiptsPercentage": 5.54,
            "deliveriesPercentage": 5.58,
            "ClosingStockPercentage": 5.54,
            "OS_HLPercent": 35.8,
            "receipts_HLPercent": 108.36,
            "Deliveries_HLPercent": 46.93,
            "CS_HLPercent": 97.06
        },
        "stockReturnDate": "03-2020",
        "totalDutyOwed": 0,
        "totalHLPercent": 0
    }
    
    stockreturn2 = {
        "beer": "Sheep Stealer",
        "otherBreweryCheckRec": "false",
        "otherCountryCheckRec": "false",
        "otherBreweryCheckDel": "false",
        "otherCountryCheckDel": "false",
        "totalsInventory": {
            "openingStock330Cases": "16",
            "openingStock500Cases": "50",
            "openingStockKegs": "7",
            "recieptsCases330": 0,
            "recieptsCases500": 161,
            "recieptsKegs": 33,
            "deliveries330Cases": 16,
            "deliveries500Cases": 54,
            "deliveriesKegs": 13,
            "closingStockCases330": 0,
            "closingStockCases500": 157,
            "closingStockKegs": 27,
            "OS_HL": 6.37,
            "receipts_HL": 19.56,
            "deliveries_HL": 8.41,
            "CS_HL": 17.52,
            "openingStockPercentage": "5.62",
            "receiptsPercentage": 5.54,
            "deliveriesPercentage": 5.58,
            "ClosingStockPercentage": 5.54,
            "OS_HLPercent": 35.8,
            "receipts_HLPercent": 108.36,
            "Deliveries_HLPercent": 46.93,
            "CS_HLPercent": 97.06
        },
        "stockReturnDate": "03-2020",
        "totalDutyOwed": 0,
        "totalHLPercent": 0
    }

    stockReturnCollection.insert_one(stockreturn1)
    stockReturnCollection.insert_one(stockreturn2)

def test_setupTestDatabase():
    populateBrews()
    populateInventories()
    populateStockReturns()
    assert 0 == 0

#Test for calculating ABV%
def test_calculateABV():
    assert calculations.calculateABV(1.0440, 1.0018) == 5.49
    assert calculations.calculateABV(1.045, 1.0094) == 4.59

    # Ridiculous values for determining abv, should equal 0
    assert calculations.calculateABV(100, 100) == 0

# Tsts for calculating post condition volumes of beer
def test_calculatePCV():
    assert calculations.calculatePCV(16, 131, 0) == 913
    assert calculations.calculatePCV(0, 161, 0) == 966
    assert calculations.calculatePCV(10, 0, 0) == 79
    assert calculations.calculatePCV(0, 0, 20) == 600
    assert calculations.calculatePCV(0, 0, 0) == 0
    assert calculations.calculatePCV(100, 100, 100) == 4392

# Test Duty that is owed on brew
def test_calculateDuty():
    assert calculations.calculateDuty(948, 5.46) == 582.31
    assert calculations.calculateDuty(966, 5.49) == 596.63
    assert calculations.calculateDuty(828, 4.90) == 456.44

# Test Inventory Calculations
def test_inventoryCalculations():
    assert calculations.inventoryCalculations(brewCollection,["SS00619", 0, 0 ,27,0, 0, 6]) == [0, 0, 6, 810, 5534.1, 1006.2, 4527.9, 990, '03-03-2020']
    assert calculations.inventoryCalculations(brewCollection,["SS00719", 157, 0 ,0,4, 0, 0]) == [4, 0, 0, 942, 5303.34, 131.76, 5171.58, 966,'05-03-2020']

def test_calculateTotalUnits():
    # Test calculations for totals in inventories
    assert calculations.calculateTotalUnits(brewCollection ,inventoryCollection, "Sheep Stealer", False, "03-2020") == {
        "totalMonthlyCases500Sold": 4,
        "total500CasesSold": 4,
        "totalRemainingCases500": 157,
        "totalMonthlyCases330Sold": 0,
        "totalCasesSold330Month": "0",
        "total330CasesSold": 0,
        "totalRemainingCases330": 0,
        "totalMonthlyKegsSold": 6,
        "totalInvKegsSold": 6,
        "totalRemainingKegs": 27,
        "totalReceiptsAvg": 10837.44,
        "totalSoldMonthAvg": 1137.96,
        "totalAvgRemaining": 9699.48,
        "totalMonthlyCases500SoldTL": 24,
        "total500CasesSoldTL": 24,
        "totalRemainingCases500TL": 942,
        "totalMonthlyCases330SoldTL": 0,
        "total330CasesSoldTL": 0,
        "totalRemainingCases330TL": 0,
        "totalMonthlyKegsSoldTL": 180,
        "totalInvKegsSoldTL": 180,
        "totalRemainingKegsTL": 810,
        "receiptsAvgNewPercentage": 5.54,
        "soldMonthAvgNewPercentage": 5.58,
        "remainsAvgNewPercentage": 5.54,
        "litresSold": 204,
        "HLSold": 2.04
    }

    # Test calculations for totals in stock returns
    assert calculations.calculateTotalUnits(brewCollection ,inventoryCollection, "Sheep Stealer", True, "03-2020") == {
        "openingStock330Cases": "16",
        "openingStock500Cases": "50",
        "openingStockKegs": "7",
        "recieptsCases330": 0,
        "recieptsCases500": 161,
        "recieptsKegs": 33,
        "deliveries330Cases": 16,
        "deliveries500Cases": 54,
        "deliveriesKegs": 13,
        "closingStockCases330": 0,
        "closingStockCases500": 157,
        "closingStockKegs": 27,
        "OS_HL": 6.37,
        "receipts_HL": 19.56,
        "deliveries_HL": 8.41,
        "CS_HL": 17.52,
        "openingStockPercentage": "5.62",
        "receiptsPercentage": 5.54,
        "deliveriesPercentage": 5.58,
        "ClosingStockPercentage": 5.54,
        "OS_HLPercent": 35.8,
        "receipts_HLPercent": 108.36,
        "Deliveries_HLPercent": 46.93,
        "CS_HLPercent": 97.06
    }

def test_calculateStockReturnTotalHL():
    assert calculations.calculateStockReturnTotalHL(stockReturnCollection.find({}),"03-2020") == [93.86,1058.2715]

def test_deleteAllDBDocuments():
    brewCollection.remove()
    inventoryCollection.remove()
    stockReturnCollection.remove()

