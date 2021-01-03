# required packages
import random
import numpy as np
import matplotlib.pyplot as plt

from sklearn.cluster import KMeans
from csv import reader
from sklearn.impute._iterative import IterativeImputer
from kneed import KneeLocator
import json
import pandas as pd

from sklearn.preprocessing import StandardScaler

# global variables
numberDataPoints4ReducedData = 250
numberDataPoints = 999

def task1():
    latitude = [None]*999
    longitude = [None]*999
    sumArray = [0]*9
    avArray = [0]*9
    countArray = [0]*9

    numberInEachState = [None]*51
    for i in range(0,len(numberInEachState)):
        numberInEachState[i] = 0
    # need to figure out how to get 1000th company

    # I open and save the data
    data = [None] * 1000
    with open('fortune1000-final.csv', 'r', newline='', encoding='ISO-8859-1') as csvfile:
        for i in range(0, 1000):
            data[i] = csvfile.readline()
    csvfile.close()

    # remove unnecessary characters
    trantab = str.maketrans(dict.fromkeys('$,%*()'))

    i = 0
    newData = [[None] * 10 for y in range(0, 999)]

    #convert categorical to numerical
    changeNums = { "AL": 1, "AK": 2, "AZ": 3, "AR": 4, "CA": 5, "CO": 6, "CT":7, "DE":8,
                "FL": 9, "GA": 10, "HI": 11, "ID": 12, "IL": 13, "IN": 14, "IA":15, "KS":16,
                "KY": 17, "LA": 18, "ME": 19, "MD": 20, "MA": 21, "MI": 22, "Michigan":22, "MN":23, "MS":24,
                "MO": 25, "MT": 26, "NE": 27, "NV": 28, "NH": 29, "NJ": 30, "NM":31, "NY":32,
                "NC": 33, "ND": 34, "OH": 35, "OK": 36, "OR": 37, "PA": 38, "RI":39, "SC":40,
                "SD": 41, "TN": 42, "TX": 43, "UT": 44, "VT": 45, "VA": 46, "WA":47, "WV":48,
                "WI": 49, "WY": 50, "Puerto Rico": 51
             }

    # searches for continuous data and add to "newData"
    for line in reader(data):
        # if(line[0]=="rank"):
        #     print(line[9])
        #     print(line[14])
        #     print(line[16])
        if (line[0] != "rank"):
            for j in range(0, 19):
                if j==0:
                    if line[j+2].translate(trantab) == "-" or line[j+2].translate(trantab) == "":
                        newData[i][0]=np.nan
                    else:
                        newData[i][0] = abs(float(line[j].translate(trantab)) - float(line[j+2].translate(trantab)))
                        sumArray[0] = sumArray[0] + newData[i][0]
                        countArray[0] = countArray[0] + 1
                elif j == 3:
                    if line[j].translate(trantab) == "-" or line[j].translate(trantab) == "":
                        newData[i][1] = np.nan
                    else:
                        newData[i][1] = float(line[j].translate(trantab))
                        sumArray[1] = sumArray[1] + newData[i][1]
                        countArray[1] = countArray[1] + 1
                elif j == 4:
                    if line[j].translate(trantab) == "-" or line[j].translate(trantab) == "":
                        newData[i][2] = np.nan
                    else:
                        newData[i][2] = float(line[j].translate(trantab))
                        sumArray[2] = sumArray[2] + newData[i][2]
                        countArray[2] = countArray[2] + 1
                elif j == 5:
                    if line[j].translate(trantab) == "-" or line[j].translate(trantab) == "":
                        newData[i][3] = np.nan
                    else:
                        newData[i][3] = float(line[j].translate(trantab))
                        sumArray[3] = sumArray[3] + newData[i][3]
                        countArray[3] = countArray[3] + 1
                elif j == 6:
                    if line[j].translate(trantab) == "-" or line[j].translate(trantab) == "":
                        newData[i][4] = np.nan
                    else:
                        newData[i][4] = float(line[j].translate(trantab))
                        sumArray[4] = sumArray[4] + newData[i][4]
                        countArray[4] = countArray[4] + 1
                elif j == 7:
                    if line[j].translate(trantab) == "-" or line[j].translate(trantab) == "":
                        newData[i][5] = np.nan
                    else:
                        newData[i][5] = float(line[j].translate(trantab))
                        sumArray[5] = sumArray[5] + newData[i][5]
                        countArray[5] = countArray[5] + 1
                elif j == 8:
                    if line[j].translate(trantab) == "-" or line[j].translate(trantab) == "":
                        newData[i][6] = np.nan
                    else:
                        newData[i][6] = float(line[j].translate(trantab))
                        sumArray[6] = sumArray[6] + newData[i][6]
                        countArray[6] = countArray[6] + 1
                elif j == 9:
                    if line[j].translate(trantab) == "-" or line[j].translate(trantab) == "":
                        newData[i][7] = np.nan
                    else:
                        newData[i][7] = float(line[j].translate(trantab))
                        sumArray[7] = sumArray[7] + newData[i][7]
                        countArray[7] = countArray[7] + 1
                elif j == 14:
                    if line[j].translate(trantab) == "-" or line[j].translate(trantab) == "":
                        newData[i][8] = 0
                    else:
                        newData[i][8] = float(line[j].translate(trantab))
                        sumArray[8] = sumArray[8] + newData[i][8]
                        countArray[8] = countArray[8] + 1
                elif j== 16:
                    if line[j] == "-" or line[j] == "":
                        newData[i][9] = np.nan
                    else:
                        #convert categorical to numerical
                        newData[i][9] = changeNums[line[j]]

                        numberInEachState[changeNums[line[j]]-1] = numberInEachState[changeNums[line[j]]-1] + 1
                elif j==17:
                    if line[j] == "-" or line[j] == "":
                        latitude[i]= np.nan
                    else:
                        #convert categorical to numerical
                        latitude[i] = float(line[j])  
                elif j==18:
                    if line[j] == "-" or line[j] == "":
                        longitude[i]= np.nan
                    else:
                        #convert categorical to numerical
                        longitude[i] = float(line[j])                                        

            i = i + 1

    # get rid of NaN data
    X = np.array(newData)
    imp = IterativeImputer(max_iter=10, random_state=0, sample_posterior=True)
    imp.fit(X)

    # would not replace old object for some reason
    anotherX = np.array(np.round(imp.transform(X)))
    # print(anotherX)
    # anotherX = StandardScaler().fit_transform(anotherX)
    # print("new another x")
    # print(anotherX)
    for i in range(0,9):
        avArray[i] = sumArray[i]/countArray[i]

    # print(avArray)


    # empty array for squared distance
    squaredDistance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    # calculate the squared distance for each cluster --> elbow method
    for i in range(1, 11):
        kmeans = KMeans(n_clusters=i, random_state=0).fit(anotherX)
        for j in range(0, 999): #for number of data points
            for m in range(0, 10): #for number of dimensions
                squaredDistance[i - 1] = squaredDistance[i - 1] + (
                        kmeans.cluster_centers_[kmeans.labels_[j]][m] - anotherX[j][m]) ** 2
                        
    # Option to show graph of elbow method
    
    # plt.plot([1,2,3,4,5,6,7,8,9,10], squaredDistance)
    kneeL = KneeLocator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], squaredDistance, curve='convex', direction='decreasing') #org uncomment
    # kneeL.plot_knee()
    # plt.xlabel("Clusters")
    # plt.ylabel("Squared Distance")
    # plt.show()
    # print(kneeL.knee)

    # from each cluster, I calculate how many items to take
    kmeans = KMeans(n_clusters=kneeL.knee, random_state=0).fit(anotherX)
    numberOfDataPoints = [0] * kneeL.knee
    numberOfDataPoints_New = [0] * kneeL.knee

    # info on largest cluster
    maxLocation = 0
    maxValue = 0
    sum = 0


    # I count how many items are in each cluster
    for i in range(0, 999):
        numberOfDataPoints[kmeans.labels_[i]] = numberOfDataPoints[kmeans.labels_[i]] + 1
    for i in range(0, kneeL.knee):
        numberOfDataPoints_New[i] = round(numberOfDataPoints[i] * .25)
        if numberOfDataPoints_New[i] > maxValue:
            maxValue = numberOfDataPoints_New[i]
            maxLocation = i
        sum = numberOfDataPoints_New[i] + sum

    # if the sum is greater than 250, I rounded too high and must reduce the number
    # I remove from the largest position
    while sum > 250:
        numberOfDataPoints_New[maxLocation] = numberOfDataPoints_New[maxLocation] - 1
        sum = sum - 1

    # gets random numbers (representing index number) proportional to the cluster size
    stratifiedRandomNumbers = []
    for j in range(0, kneeL.knee):
        truth = True
        count = 0
        while (truth):
            randomNumber = random.randint(1, 998)
            if randomNumber not in stratifiedRandomNumbers:
                if kmeans.labels_[randomNumber] == j:
                    stratifiedRandomNumbers.append(randomNumber)
                    count = count + 1
            if count == numberOfDataPoints_New[j]:
                truth = False

    # print(stratifiedRandomNumbers)

    # I get 25% of the data by random
    listOfRandomNumbers = []

    truth = True
    while truth:
        randomNumber = random.randint(0, 998)
        if randomNumber not in listOfRandomNumbers:
            listOfRandomNumbers.append(randomNumber)
        if len(listOfRandomNumbers) == 250:
            truth = False
    #print(listOfRandomNumbers)


    #I get the data associated with the numbers taken
    randomData = []
    stratifiedData = []

    targetForStrat = []
    targetForRand =[]

    stratLat =[]
    stratLong = []
    for i in range(0,250):
        stratifiedData.append(anotherX[stratifiedRandomNumbers[i]])
        randomData.append(anotherX[listOfRandomNumbers[i]])

        targetForStrat.append(kmeans.labels_[stratifiedRandomNumbers[i]])
        targetForRand.append(kmeans.labels_[listOfRandomNumbers[i]])

        stratLat.append(latitude[stratifiedRandomNumbers[i]])
        stratLong.append(longitude[stratifiedRandomNumbers[i]])
    
    targetForOrg = kmeans.labels_
    attributeNames = ["Change in Rank", "Revenue", "Revenue Change", "Profit", "Profit Change", "Assets", "Market Value", "Employees", "Years on Fortune 500 List", "State"]
    #print(stratifiedData)
    return randomData, stratifiedData, anotherX, targetForStrat, targetForRand, targetForOrg, attributeNames, latitude,longitude, stratLat, stratLong, numberInEachState, avArray

# task1()