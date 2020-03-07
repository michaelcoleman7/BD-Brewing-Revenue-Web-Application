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
    return round(postConditionVolume, 0)

def calculateDuty(postConditionVolume , abv):
    duty = (postConditionVolume/100 * abv * 22.5)/2
    return round(duty, 2)

def inventoryCalculations(brewCollection, calculationVariables):
    brewDetails = brewCollection.find( { "batchNo": calculationVariables[0] } )
    for document in brewDetails:
        brewDate = document["brewDate"]
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

        monthPCV = calculatePCV(calculationVariables[5] ,calculationVariables[4], calculationVariables[6] )
        soldAvgMonth = round(float(monthPCV) * float(abv), 2)

        remainingPCV = calculatePCV(calculationVariables[2] ,calculationVariables[1], calculationVariables[3] )
        AvgRemaining= round(float(remainingPCV) * float(abv), 2)
    # create json format of data to send to MongoDB
    invCalculations = [
        totalCasesSold500,
        totalCasesSold330,
        totalKegsSold,
        remainingPCV,
        receiptsAvg,
        soldAvgMonth,
        AvgRemaining,
        totalLitres,
        brewDate
    ]
    return invCalculations

def calculateTotalUnits(brewCollection,inventoryCollection, beer, stockReturn, monthToCalculateUsing):
    #retrieval = inventoryCollection.find({},{ "receiptsAvg": 1, "_id": 0 })
    retrieval = inventoryCollection.find({})
    totalReceiptsAvg = 0
    totalSoldMonthAvg = 0
    totalAvgRemaining = 0
    totalMonthlyCases500Sold = 0
    total500CasesSold = 0
    totalRemainingCases500 = 0
    totalMonthlyCases330Sold = 0
    total330CasesSold = 0
    totalRemainingCases330 = 0
    totalMonthlyKegsSold = 0
    totalInvKegsSold = 0
    totalRemainingKegs = 0
    averageReceiptsDivisial = 0.0
    totalReceiptsCases500 = 0
    totalReceiptsCases330 = 0
    totalReceiptsKegs = 0
    receiptsAvgNewPercentage = 0.0
    openingStockPercentage = 0.0

    for document in retrieval: 
        brewDate = document["brewDate"]
        brewDateByMonth = brewDate[3:]
        if document["beer"] == beer and brewDateByMonth == monthToCalculateUsing:
            #Total 500 Calculations
            totalCasesSold500Month = document["totalCasesSold500Month"]
            totalCasesSold500 = document["totalCasesSold500"]
            remainingCases500 = document["remainingCases500"]

            totalMonthlyCases500Sold += int(totalCasesSold500Month)
            total500CasesSold +=int(totalCasesSold500)
            totalRemainingCases500 += int(remainingCases500)

            # Total 330 Calculations
            totalCasesSold330Month = document["totalCasesSold330Month"]
            totalCasesSold330 = document["totalCasesSold330"]
            remainingCases330 = document["remainingCases330"]

            totalMonthlyCases330Sold += int(totalCasesSold330Month)
            total330CasesSold += int(total330CasesSold)
            totalRemainingCases330 += int(remainingCases330)

            # Total Keg Calculations
            totalKegsSoldMonth = document["totalKegsSoldMonth"]
            totalKegsSold = document["totalKegsSold"]
            remainingKegs = document["remainingKegs"]
            
            totalMonthlyKegsSold += int(totalKegsSoldMonth)
            totalInvKegsSold += int(totalKegsSold)
            totalRemainingKegs += int(remainingKegs)

            receiptsAvg = document["receiptsAvg"]
            soldAvgMonth = document["soldAvgMonth"]
            AvgRemaining = document["AvgRemaining"]

            totalReceiptsAvg += receiptsAvg
            totalSoldMonthAvg += soldAvgMonth
            totalAvgRemaining += AvgRemaining

            totalLitres = document["totalLitres"]

            if float(receiptsAvg) > 0.0:
                averageReceiptsDivisial += totalLitres
                brewDetails = brewCollection.find({"batchNo": document["batchNo"]})
                for brewdocument in brewDetails:
                    totalReceiptsCases500 += int(brewdocument["bottleNo500"])
                    totalReceiptsCases330 += int(brewdocument["bottleNo330"])
                    totalReceiptsKegs += int(brewdocument["kegNo"])
            
            # Opening stock initialisations
            openingStock330Cases = document["openingStock330Cases"]
            openingStock500Cases = document["openingStock500Cases"]
            openingStockKegs = document["openingStockKegs"]
            openingStockPercentage = document["openingStockPercentage"]


            # Deliveries calculations
            deliveries330Cases = (int(openingStock330Cases) + totalReceiptsCases330) - totalRemainingCases330
            deliveries500Cases = (int(openingStock500Cases) + totalReceiptsCases500) - totalRemainingCases500
            deliveriesKegs = (int(openingStockKegs) + totalReceiptsKegs) - totalRemainingKegs

            # Calculate HL for Opening Stock, Receipts, Deliveries and Closing Stock
            OS_HL = round(calculatePCV(openingStock330Cases ,openingStock500Cases, openingStockKegs ) / 100, 2)
            receipts_HL = round(calculatePCV(totalReceiptsCases330 ,totalReceiptsCases500, totalReceiptsKegs ) / 100 ,2)
            deliveries_HL = round(calculatePCV(deliveries330Cases ,deliveries500Cases, deliveriesKegs ) / 100, 2)
            CS_HL = round(calculatePCV(totalRemainingCases330 ,totalRemainingCases500, totalRemainingKegs ) / 100 ,2)

    totalMonthlyCases500SoldTL = totalMonthlyCases500Sold * 6
    total500CasesSoldTL = total500CasesSold * 6
    totalRemainingCases500TL = totalRemainingCases500 * 6
    totalMonthlyCases330SoldTL = totalMonthlyCases330Sold * 7.92
    total330CasesSoldTL = total330CasesSold * 7.92
    totalRemainingCases330TL = totalRemainingCases330 * 7.92
    totalMonthlyKegsSoldTL = totalMonthlyKegsSold * 30
    totalInvKegsSoldTL = totalInvKegsSold * 30
    totalRemainingKegsTL = totalRemainingKegs * 30

    if averageReceiptsDivisial != 0:
        receiptsAvgNewPercentage = round(totalReceiptsAvg / averageReceiptsDivisial, 2)
    
    # Calculate monthly sold average %
    soldMonthAvgNewPercentage = round(totalSoldMonthAvg / (totalMonthlyCases500SoldTL + totalMonthlyCases330SoldTL + totalMonthlyKegsSoldTL), 2)
    # Calculate remaining average new %
    remainsAvgNewPercentage = round(totalAvgRemaining / (totalRemainingCases500TL + totalRemainingCases330TL + totalRemainingKegsTL) , 2)
    
    litresSold = round(total500CasesSoldTL + total330CasesSoldTL + totalInvKegsSoldTL, 2)
    HLSold = round(litresSold / 100, 2)

    OS_HLPercent = round(OS_HL * float(openingStockPercentage), 2)
    receipts_HLPercent  = round(receipts_HL * receiptsAvgNewPercentage, 2)
    Deliveries_HLPercent = round(deliveries_HL * soldMonthAvgNewPercentage, 2)
    CS_HLPercent = round(CS_HL * remainsAvgNewPercentage, 2)


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
        "totalReceiptsAvg": round(totalReceiptsAvg, 2),
        "totalSoldMonthAvg": round(totalSoldMonthAvg, 2),
        "totalAvgRemaining": round(totalAvgRemaining, 2),
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

    stockReturnInfoInventory = {
        "openingStock330Cases": openingStock330Cases,
        "openingStock500Cases": openingStock500Cases,
        "openingStockKegs": openingStockKegs,
        "recieptsCases330": totalReceiptsCases330,
        "recieptsCases500": totalReceiptsCases500,
        "recieptsKegs": totalReceiptsKegs,
        "deliveries330Cases": deliveries330Cases,
        "deliveries500Cases": deliveries500Cases,
        "deliveriesKegs": deliveriesKegs,
        "closingStockCases330": totalRemainingCases330,
        "closingStockCases500": totalRemainingCases500,
        "closingStockKegs": totalRemainingKegs,
        "OS_HL": OS_HL,
        "receipts_HL": receipts_HL,
        "deliveries_HL": deliveries_HL,
        "CS_HL": CS_HL,
        "openingStockPercentage": openingStockPercentage,
        "receiptsPercentage": receiptsAvgNewPercentage,
        "deliveriesPercentage": soldMonthAvgNewPercentage,
        "ClosingStockPercentage": remainsAvgNewPercentage,
        "OS_HLPercent": OS_HLPercent,
        "receipts_HLPercent": receipts_HLPercent,
        "Deliveries_HLPercent": Deliveries_HLPercent,
        "CS_HLPercent": CS_HLPercent
    }
    if stockReturn == False:
        return totalsInventory
    else:
        return stockReturnInfoInventory

def calculateStockReturnTotalHL(stockReturn,monthToCalculateUsing):
    totalHLPercent = 0.0
    totalDutyOwed = 0.0
    for document in stockReturn:
        stockreturnDate = document["stockReturnDate"]
        if(monthToCalculateUsing == stockreturnDate):
            totalsInventory = document["totalsInventory"]
            Deliveries_HLPercent= totalsInventory["Deliveries_HLPercent"]
            totalHLPercent += float(Deliveries_HLPercent)
    totalDutyOwed = totalHLPercent * (22.55/2)
    return [totalHLPercent,totalDutyOwed]
    