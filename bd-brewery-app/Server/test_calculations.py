import calculations
from routes import brewCollection,inventoryCollection


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
    assert calculations.inventoryCalculations(brewCollection,["SS00619", 0, 0 ,27,0, 0, 6]) == [0, 0, 6, 810, 5534.1, 1006.2, 4527.9, 990]
    assert calculations.inventoryCalculations(brewCollection,["SS00719", 157, 0 ,0,4, 0, 0]) == [4, 0, 0, 942, 5303.34, 131.76, 5171.58, 966]

def test_calculateTotalUnits():
    assert calculations.calculateTotalUnits(brewCollection ,inventoryCollection, "Sheep Stealer", True) == {"totalMonthlyCases500Sold": 4,
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
