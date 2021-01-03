from csv import reader
import numpy as np
import json


changeNums = {"AL": 1, "AK": 2, "AZ": 3, "AR": 4, "CA": 5, "CO": 6, "CT": 7, "DE": 8,
              "FL": 9, "GA": 10, "HI": 11, "ID": 12, "IL": 13, "IN": 14, "IA": 15, "KS": 16,
              "KY": 17, "LA": 18, "ME": 19, "MD": 20, "MA": 21, "MI": 22, "Michigan": 22, "MN": 23, "MS": 24,
              "MO": 25, "MT": 26, "NE": 27, "NV": 28, "NH": 29, "NJ": 30, "NM": 31, "NY": 32,
              "NC": 33, "ND": 34, "OH": 35, "OK": 36, "OR": 37, "PA": 38, "RI": 39, "SC": 40,
              "SD": 41, "TN": 42, "TX": 43, "UT": 44, "VT": 45, "VA": 46, "WA": 47, "WV": 48,
              "WI": 49, "WY": 50, "Puerto Rico": 51
              }

changeNums2 = {"Alabama": 1, "Alaska": 2, "Arizona": 3, "Arkansas": 4, "California": 5, "Colorado": 6, "Connecticut": 7, "Delaware": 8,
              "Florida": 9, "Georgia": 10, "Hawaii": 11, "Idaho": 12, "Illinois": 13, "Indiana": 14, "Iowa": 15, "Kansas": 16,
              "Kentucky": 17, "Louisiana": 18, "Maine": 19, "Maryland": 20, "Massachusetts": 21, "Michigan": 22, "Minnesota": 23, "Mississippi": 24,
              "Missouri": 25, "Montana": 26, "Nebraska": 27, "Nevada": 28, "New Hampshire": 29, "New Jersey": 30, "New Mexico": 31, "New York": 32,
              "North Carolina": 33, "North Dakota": 34, "Ohio": 35, "Oklahoma": 36, "Oregon": 37, "Pennsylvania": 38, "Rhode Island": 39, "South Carolina": 40,
              "South Dakota": 41, "Tennessee": 42, "Texas": 43, "Utah": 44, "Vermont": 45, "Virginia": 46, "Washington": 47, "West Virginia": 48,
              "Wisconsin": 49, "Wyoming": 50, "Puerto Rico": 51, "District of Columbia" : 52
              }

changeNums3 = {"ALABAMA": 1, "ALASKA": 2, "ARIZONA": 3, "ARKANSAS": 4, "CALIFORNIA": 5, "COLORADO": 6, "CONNECTICUT": 7, "DELAWARE": 8,
              "FLORIDA": 9, "GEORGIA": 10, "HAWAII": 11, "IDAHO": 12, "ILLINOIS": 13, "INDIANA": 14, "IOWA": 15, "KANSAS": 16,
              "KENTUCKY": 17, "LOUISIANA": 18, "MAINE": 19, "MARYLAND": 20, "MASSACHUSETTS": 21, "MICHIGAN": 22, "MINNESOTA": 23, "MISSISSIPPI": 24,
              "MISSOURI": 25, "MONTANA": 26, "NEBRASKA": 27, "NEVADA": 28, "NEW_HAMPSHIRE": 29, "NEW_JERSEY": 30, "NEW_MEXICO": 31, "NEW_YORK": 32,
              "NORTH_CAROLINA": 33, "NORTH_DAKOTA": 34, "OHIO": 35, "OKLAHOMA": 36, "OREGON": 37, "PENNSYLVANIA": 38, "RHODE_ISLAND": 39, "SOUTH_CAROLINA": 40,
              "SOUTH_DAKOTA": 41, "TENNESSEE": 42, "TEXAS": 43, "UTAH": 44, "VERMONT": 45, "VIRGINIA": 46, "WASHINGTON": 47, "WEST_VIRGINIA": 48,
              "WISCONSIN": 49, "WYOMING": 50, "PUERTO RICO": 51, "DISTRICT_OF_COLUMBIA" : 52
              }


def readStates():
    data = [None] * 1000
    with open('states_all_extended.csv', 'r', newline='', encoding='ISO-8859-1') as csvfile:
        for i in range(0, 1000):
            data[i] = csvfile.readline()
            # data[i] = data[i].split("\n")
    csvfile.close()

    # trantab = str.maketrans(dict.fromkeys('$,%*()'))
    newData = [None]*1716

    #I remove excesive pop data
    count =0
    for i in range(0,len(data)):
        if(data[i]==None):
            count = count+1

    for i in range(0,count):
        data.pop()
    # for i in range(0,len(data)):
    #     print(data[i])
            # data.pop()

    #i get 2010 data
    count2 = 0
    for i in range(0, len(data)):
        tempData = data[i].split(",")
        if("2010" in tempData[0]):
            newData[count2] = tempData
            count2 = count2 +1

    difference = len(newData)- count2
    for i in range(0,difference):
        newData.pop()


    data2Pass = [None]*len(newData)
    #I get the attributes I want
    for i in range(0,len(newData)):
        temp = [None]*7
        temp[0] = changeNums3[newData[i][1]]
        temp[1] = float(newData[i][4])
        temp[2] = float(newData[i][5])
        temp[3] = float(newData[i][6])
        temp[4] = float(newData[i][7])
        temp[5] = float(newData[i][8])
        temp[6] = float(newData[i][9])

        data2Pass[i] = temp
    # print(data2Pass)
    return data2Pass

def statePopulation():
    data = [None] * 52
    with open('Energy_Census_and_Economic_Data_US_2010-2014.csv', 'r', newline='', encoding='ISO-8859-1') as csvfile:
        for i in range(0, 52):
            data[i] = csvfile.readline()
            # data[i] = data[i].split("\n")
    csvfile.close()

    newData = [None]*(len(data)-1)
    for i in range(1,len(data)):
        tempData = data[i].split(",")
        temp2 = [None]*7

        temp2[0] = changeNums2[tempData[1]]
        temp2[1] = float(tempData[6])
        temp2[2] = float(tempData[11])
        temp2[3] = float(tempData[16])
        temp2[4] = float(tempData[67])
        temp2[5] = float(tempData[141])
        temp2[6] = float(tempData[162])

        newData[i-1] = temp2
    return newData

def medianHouseholdIncome():
    data = [None] * 51
    with open('median_household_income.csv', 'r', newline='', encoding='ISO-8859-1') as csvfile:
        for i in range(0, 51):
            data[i] = csvfile.readline()
            # data[i] = data[i].split("\n")
    csvfile.close()
    # print(data)
    newData = [None]*(len(data))
    for i in range(0,len(data)):
        tempData = data[i].split(",")

        temp2 = [None]*2
        temp2[0] = changeNums2[tempData[0]]
        temp2[1] = float(tempData[1])

        newData[i] = temp2
    return newData

def unemployment():
    data = [None] * 51
    with open('unemployment_population.csv', 'r', newline='', encoding='ISO-8859-1') as csvfile:
        for i in range(0, 51):
            data[i] = csvfile.readline()
            # data[i] = data[i].split("\n")
    csvfile.close()

    newData = [None]*(len(data))
    for i in range(0,len(data)):
        tempData = data[i].split(",")

        temp2 = [None]*3
        temp2[0] = changeNums2[tempData[0]]
        temp2[1] = float(tempData[1])
        temp2[2] = float(tempData[2])

        newData[i] = temp2
    return newData

def averageIQ():
    data = [None] * 51
    with open('averageIQ.csv', 'r', newline='', encoding='ISO-8859-1') as csvfile:
        for i in range(0, 51):
            data[i] = csvfile.readline()
            # data[i] = data[i].split("\n")
    csvfile.close()

    newData = [None]*(len(data)-1)
    for i in range(1,len(data)):
        tempData = data[i].split(",")
        for m in range(0,len(tempData)):
            tempData[m]= tempData[m].replace('"','')

        temp2 = [None]*2
        temp2[0] = changeNums2[tempData[0]]
        temp2[1] = float(tempData[1])

        newData[i-1] = temp2

    return newData

def educationLevel():
    data = [None] * 50
    with open('education.csv', 'r', newline='', encoding='ISO-8859-1') as csvfile:
        for i in range(0, 50):
            data[i] = csvfile.readline()
            # data[i] = data[i].split("\n")
    csvfile.close()

    newData = [None]*(len(data))
    for i in range(0,len(data)):
        tempData = data[i].split(",")

        temp2 = [None]*4
        temp2[0] = changeNums2[tempData[0]]
        temp2[1] = float(tempData[1])
        temp2[2] = float(tempData[2])
        temp2[3] = float(tempData[3])

        newData[i] = temp2

    return newData

# def getLongLat():
#     longitute =[None]*1000
#     latitude = [None]*1000
#     data = [None]*1000

#     with open('fortune1000-final.csv', 'r', newline='', encoding='ISO-8859-1') as csvfile:
#         for i in range(0, 1000):
#             data[i] = csvfile.readline()
#     csvfile.close()

#     for line in reader(data):
#         # print(line)
#         if (line[0] != "rank"):
#             for j in range(0, 20):
#                 if j==0:
#                     if line[j+2].translate(trantab) == "-" or line[j+2].translate(trantab) == "":

#         # remove unnecessary characters
#     trantab = str.maketrans(dict.fromkeys('$,%*()'))


def getAllArray(stateFinancesData, energyData, medianHouseholdIncomeData, unemploymentData,averageIQData, educationData):
    bigDataArray = [None]*14

    length = len(stateFinancesData)
    tempColumn1 =[None]*length
    tempColumn2 =[None]*length
    tempColumn3 =[None]*length
    tempColumn4 =[None]*length
    tempColumn5 =[None]*length
    tempColumn6 =[None]*length
    tempColumn7 = [None]*length
    tempColumn8 = [None]*length
    tempColumn9 = [None]*length
    tempColumn10 = [None]*length
    tempColumn11 = [None]*length
    tempColumn12 = [None]*length
    tempColumn13 = [None]*length
    tempColumn14 = [None]*length

    # sum1 =0
    # sum2 =0
    # sum3 =0
    # sum4 =0
    sumArray = [0]*14
    avArray = [0]*14

    #state finance data
    for i in range(0,len(stateFinancesData)):
        tempColumn1[i]= stateFinancesData[i][0]
        tempColumn2[i]= stateFinancesData[i][1]   
        tempColumn3[i]= stateFinancesData[i][2]    
        tempColumn4[i]= stateFinancesData[i][3]
        tempColumn5[i]= stateFinancesData[i][4]   
        tempColumn6[i]= stateFinancesData[i][5]

        sumArray[0] = sumArray[0] + stateFinancesData[i][0]
        sumArray[1] = sumArray[1] +  stateFinancesData[i][1]
        sumArray[2] = sumArray[2] + stateFinancesData[i][2]
        sumArray[3] = sumArray[3] +  stateFinancesData[i][3]
        sumArray[4] = sumArray[4] + stateFinancesData[i][4]
        sumArray[5] = sumArray[5] +  stateFinancesData[i][5]      

    bigDataArray[0] = tempColumn1

    #energy data
    for i in range(0,len(energyData)):
        for j in range(0,len(bigDataArray[0])):
            if(energyData[i][0]==bigDataArray[0][j]):
                tempColumn7[j] = energyData[i][5]
                tempColumn8[j] = energyData[i][6]

                sumArray[6] = sumArray[6] + energyData[i][5]
                sumArray[7] = sumArray[7] +  energyData[i][6]  

    #median household income data
    for i in range(0,len(medianHouseholdIncomeData)):
        tempColumn9[i] = medianHouseholdIncomeData[i][1]

        sumArray[8] = sumArray[8] +  medianHouseholdIncomeData[i][1]  

    #unemploymentf data
    count = 0
    for i in range(0,len(unemploymentData)):
        tempColumn10[i] = unemploymentData[i][1]
        
        sumArray[9] = sumArray[9] + unemploymentData[i][1]

    #average iq data
    for i in range(0, len(averageIQData)):
        for j in range(0,len(bigDataArray[0])):
            if(averageIQData[i][0]==bigDataArray[0][j]):
                tempColumn11[j] = averageIQData[i][1]

                sumArray[10] = sumArray[10] + averageIQData[i][1]
 
    #education data
    for i in range(0, len(averageIQData)):
        for j in range(0,len(bigDataArray[0])):
            if(educationData[i][0]==bigDataArray[0][j]):
                tempColumn12[j] = educationData[i][1]
                tempColumn13[j] = educationData[i][2]    
                tempColumn14[j] = educationData[i][3]

                sumArray[11] = sumArray[11] + educationData[i][1]
                sumArray[12] = sumArray[12] +  educationData[i][2]
                sumArray[13] = sumArray[13] +  educationData[i][3]         
    # print(count)

    bigDataArray[1] = tempColumn2
    bigDataArray[2] = tempColumn3
    bigDataArray[3] = tempColumn4
    bigDataArray[4] = tempColumn5
    bigDataArray[5] = tempColumn6
    bigDataArray[6] = tempColumn7
    bigDataArray[7] = tempColumn8
    bigDataArray[8] = tempColumn9
    bigDataArray[9] = tempColumn10
    bigDataArray[10] = tempColumn11
    bigDataArray[11] = tempColumn12
    bigDataArray[12] = tempColumn13
    bigDataArray[13] = tempColumn14

    for i in range(0,len(avArray)):
        avArray[i] = sumArray[i]/length

    for i in range(0,len(bigDataArray)):
        del bigDataArray[i][8]
    # arrayMissing = [None]*length
    # arrayMissing2 = [None]*length
    # count = 0
    #check if there are any missing data points         
    # for i in range(0,len(bigDataArray)):
    #     for j in range(0, len(bigDataArray[i])):
    #         if(bigDataArray[i][j]==None):
    #             arrayMissing[count] = i
    #             arrayMissing2[count] = j
    #             count = count +1
    # print(arrayMissing)

    return bigDataArray, avArray

def getAllData():
    stateFinancesData = readStates()
    energyData = statePopulation()
    medianHouseholdIncomeData = medianHouseholdIncome()
    unemploymentData = unemployment()
    averageIQData = averageIQ()
    educationData = educationLevel()

    bigData, avArray = getAllArray(stateFinancesData, energyData, medianHouseholdIncomeData, unemploymentData,averageIQData, educationData)

    additionalData= {}
    additionalData["stateFinancesData"] = np.array(stateFinancesData).tolist()
    additionalData["energyData"] = np.array(energyData).tolist()
    additionalData["medianHouseholdIncome"] = np.array(medianHouseholdIncomeData).tolist()
    additionalData["unemploymentData"] = np.array(unemploymentData).tolist()
    additionalData["averageIQData"] = np.array(averageIQData).tolist()
    additionalData["educationData"] = np.array(educationData).tolist()
    additionalData["bigData"] = np.array(bigData).tolist()
    additionalData["avArray"] = np.array(avArray).tolist()

    json_dataAdditional = json.dumps(additionalData)

    return json_dataAdditional

