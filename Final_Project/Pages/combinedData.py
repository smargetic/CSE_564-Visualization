import numpy as np


import json
import pandas as pd
import math

from csv import reader
import numpy as np
import json
from django.http import HttpResponse
from sklearn.decomposition import PCA
from sklearn import preprocessing

from . import Task1

# import Task1
from . import ReadCSVFiles
# import ReadCSVFiles
from sklearn.preprocessing import StandardScaler
from numpy import linalg as LA
from sklearn import decomposition
from sklearn import manifold
from sklearn.manifold import MDS
from sklearn.metrics import pairwise_distances

def myfunction():
    #data from task 1
    randomData, stratifiedData, anotherX, targetForStrat, targetForRand, targetForOrg, attributeNames, latitude,longitude, stratLat, stratLong, numberInEachState, avArray = Task1.task1()
    #additional data
    stateFinancesData = ReadCSVFiles.readStates()
    energyData = ReadCSVFiles.statePopulation()
    medianHouseholdIncomeData = ReadCSVFiles.medianHouseholdIncome()
    unemploymentData = ReadCSVFiles.unemployment()
    averageIQData = ReadCSVFiles.averageIQ()
    educationData = ReadCSVFiles.educationLevel()

    bigData, avArray = ReadCSVFiles.getAllArray(stateFinancesData, energyData, medianHouseholdIncomeData, unemploymentData,averageIQData, educationData)


    # print(anotherX)
    # print(len(anotherX))
    # for i in range(0,20):
    #     print(anotherX[i])

    superTempArray = [None]*997
    #link state with other attributes
    for i in range(0,999):

        if(i<742):
            tempArray = [None]*22
            for j in range(0,9):
                tempArray[j] = anotherX[i][j]
            #get big Data items associated with state
            # tempArray = [None]*12

            tempNum = int(anotherX[i][9])-1
            for j in range(1,14):
                tempArray[j+8] = bigData[j][tempNum]

            superTempArray[i] = tempArray
        elif((i>742)and(i<923)):
            tempArray = [None]*22
            for j in range(0,9):
                tempArray[j] = anotherX[i][j]
            #get big Data items associated with state
            # tempArray = [None]*12

            tempNum = int(anotherX[i][9])-1
            for j in range(1,14):
                tempArray[j+8] = bigData[j][tempNum]

            superTempArray[i-1] = tempArray
        elif(i>923):
            tempArray = [None]*22
            for j in range(0,9):
                tempArray[j] = anotherX[i][j]
            #get big Data items associated with state
            # tempArray = [None]*12

            tempNum = int(anotherX[i][9])-1
            for j in range(1,14):
                tempArray[j+8] = bigData[j][tempNum]
            
            superTempArray[i-2] = tempArray


    anotherX = np.array(superTempArray)

    orgData_std = StandardScaler().fit_transform(anotherX)
 

    # print(orgData_std)
    # for i in range(0,len(orgData_std)):
    #     for j in range(0, len(orgData_std[i])):
    #         if(math.isnan(orgData_std[i][j])==True):
    #             print("TRUEE")
    # print(math.isnan(orgData_std))
    #pca = decomposition.PCA(n_components=3)
    pcaOrg = decomposition.PCA()

    # I transform the data and get respective eigenvalues
    sklearn_pcaOrg = pcaOrg.fit_transform(orgData_std)

    orgEigVal = pcaOrg.explained_variance_


    sumOfOrgEig =0

    contSumOfOrgEig = [None]*22

    #calculate sum of all eigenval
    for i in range(0,22):
        sumOfOrgEig = orgEigVal[i] + sumOfOrgEig

        contSumOfOrgEig[i] = sumOfOrgEig
        
    
    orgVarArray = [None]*22

    #calculate variance array
    for i in range(0,22):
        orgVarArray[i] = orgEigVal[i]/sumOfOrgEig

    sumOrgVar =0

    #get the sum of variances (total variance)
    for i in range(0,22):
        sumOrgVar = sumOrgVar + orgVarArray[i]

    tempOrgVarSum =0

    orgIntrDimCount = 0

    #get when 75% of the total variance occured
    for i in range(0,22):
        tempOrgVarSum = tempOrgVarSum + orgVarArray[i]
        if((tempOrgVarSum >(sumOrgVar*.75))and(orgIntrDimCount==0)):
            orgIntrDimCount = i

 
    #calculate loading factors
    pcaOrgNew = decomposition.PCA(n_components=orgIntrDimCount)

    sklearn_pcaOrg = pcaOrgNew.fit_transform(orgData_std)

    orgLoadFact = pcaOrgNew.components_.T * np.sqrt(pcaOrgNew.explained_variance_)


    orgSumOfSquaredLoad = [[0 for i in range(0,2)] for j in range(0,22)]

    #get attributes with highest PCA loading

    for i in range(0,22):
        for j in range(0, orgIntrDimCount):
            orgSumOfSquaredLoad[i] = orgSumOfSquaredLoad[i] + (orgLoadFact[i][j])**2   
            orgSumOfSquaredLoad[i][1]= i   

    #I sort the arrays
    orgSumOfSquaredLoad.sort(key=lambda x: x[0])
    

    #I get the highest 3 attributes
    orgThreeHighAttr = np.array(orgSumOfSquaredLoad[-3:])

    orgThreeHighAttrData = [[0 for i in range(0,3)] for j in range(0,997)]

    #I get the data associated with the three highest attribtues
    
    for j in range(0,997):
        for i in range(0,3):
            orgThreeHighAttrData[j][i] = orgData_std[j][int(orgThreeHighAttr[i][1])]

    #names of the three highest attributes
    orgColumns = [None]*3

    attributeNames = ['Change in Rank', 'Revenue', 'Revenue Change', 'Profit', 'Profit Change', 'Assets', 'Market Value', 'Employees', 'Years on Fortune 500 List',
                    'Total Revenue', 'Federal Revenue','State Revenue','Total Expenditure','Instruction Expenditure','GDP','Census','Median Household Income',
                    'Unemployment Rate','Average IQ','High School Graduate','Bachelors Graduate','Masters Graduate']
    for i in range(0,3):
        orgColumns[i] = (attributeNames[int(orgThreeHighAttr[i][1])])
    
    org3Data = pd.DataFrame(data = orgThreeHighAttrData, columns = orgColumns)

    targetForOrg2 = pd.DataFrame(data=targetForOrg, columns = ['Target'])

    #create the array with data points for 3 attr and cluster associated with that
    org3DataFinal = pd.concat([org3Data, targetForOrg2[['Target']]], axis=1)

    #create an array with coordinates for 3 attr scatter plot
    bigOrg3Array = [[0 for i in range(0,9)] for j in range (0,997)]


    for m in range(0,997):
        count =0
        for j in range(0,3):
            for i in range(0,3):
                bigOrg3Array[m][count]=([org3DataFinal.values[m][i],org3DataFinal.values[m][j]])
                count = count +1
    # print(bigOrg3Array)
    #to visualize data on top 2 pcaVectors
    pcaVisOrg = decomposition.PCA(n_components=2)

    principalDFOrg = pd.DataFrame(data = pcaVisOrg.fit_transform(orgData_std), columns = ['Principal Component 1', 'Principal Component 2'])

    # targetForStrat2 = pd.DataFrame(data=targetForStrat, columns = ['Target'])
    # targetForRand2 = pd.DataFrame(data=targetForRand, columns = ['Target'])
    targetForOrg2 = pd.DataFrame(data=targetForOrg, columns = ['Target'])
    #print(targetForStrat)
    #last row will show the cluster associated w/ each data point

    finalDFOrg = pd.concat([principalDFOrg, targetForOrg2[['Target']]], axis=1)

    
    #mds
    mds_dataOrg = manifold.MDS(n_components=2, dissimilarity='precomputed')

    #mds with euclidean
    orgSimEuc = pairwise_distances(orgData_std, metric= 'euclidean')
    # print("printing org sim euc")
    # print(orgSimEuc)

    orgDEuc = mds_dataOrg.fit_transform(orgSimEuc)

    orgMDSdatEuc = pd.DataFrame(orgDEuc)

    finalMDSOrgDataEuc = pd.concat([orgMDSdatEuc, targetForOrg2[['Target']]], axis=1)

    #mds with corr
    orgSimCor = pairwise_distances(orgData_std, metric= 'correlation')

    orgDCor = mds_dataOrg.fit_transform(orgSimCor)

    orgMDSdatCor = pd.DataFrame(orgDCor)

    finalMDSOrgDataCor = pd.concat([orgMDSdatCor, targetForOrg2[['Target']]], axis=1)



    #json data --> to export to front end
    data = {}

    data['orgEigVal'] = orgEigVal.tolist()
    data['orgLoadFact'] = orgLoadFact.tolist()
    data['orgSigNum'] = orgIntrDimCount  
    data['sumOfOrgEig'] = contSumOfOrgEig

    finalMDSOrgDataEuc = np.array(finalMDSOrgDataEuc).tolist()
    finalMDSOrgDataCor= np.array(finalMDSOrgDataCor).tolist()
    org3DataFinal = np.array(org3DataFinal).tolist()
    finalDFOrg = np.array(finalDFOrg).tolist()
    for i in range(0,2):
        finalMDSOrgDataEuc.pop()
        finalMDSOrgDataCor.pop()
        org3DataFinal.pop()
        finalDFOrg.pop()
    # print(finalMDSOrgDataCor)
    # print(org3DataFinal)
    # print(contSumOfOrgEig)

    # print("\n\n")

    # print(bigOrg3Array)
    data['pca2OrgValues'] = np.array(finalDFOrg).tolist()
    data['orgMDSDataEuc'] = finalMDSOrgDataEuc
    data['orgMDSDataCor'] = finalMDSOrgDataCor
    data['org3LoadData'] = org3DataFinal
    data['org3AttrNames'] = orgColumns
    data['bigOrg3Array'] = bigOrg3Array

    # print(bigOrg3Array)
    # print(data)
    json_data2 = json.dumps(data)
    # print(json_data2)
    return json_data2




myfunction()

