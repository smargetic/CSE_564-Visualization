
import numpy as np


import json
import pandas as pd


from django.http import HttpResponse
from sklearn.decomposition import PCA
from sklearn import preprocessing
# from Task1 import stratifiedData
# from Task1 import randomData
# from Task1 import anotherX
from . import Task1
from sklearn.preprocessing import StandardScaler
from numpy import linalg as LA
from sklearn import decomposition
from sklearn import manifold
from sklearn.manifold import MDS
from sklearn.metrics import pairwise_distances


def myfunction():
    randomData, stratifiedData, anotherX, targetForStrat, targetForRand, targetForOrg, attributeNames = Task1.task1()
    #randData_std, stratData_std, orgData_std, targetForStrat, targetForRand, targetForOrg, attributeNames = Task1.task1()
    # I standardize/center the data --> MAKE SURE IT CENTERS
    stratData_std = StandardScaler().fit_transform(stratifiedData)
    randData_std = StandardScaler().fit_transform(randomData)
    orgData_std = StandardScaler().fit_transform(anotherX)
 
    #pca = decomposition.PCA(n_components=3)
    pcaStrat = decomposition.PCA()
    pcaRand = decomposition.PCA()
    pcaOrg = decomposition.PCA()

    # I transform the data and get respective eigenvalues
    sklearn_pcaStrat = pcaStrat.fit_transform(stratData_std)
    sklearn_pcaRand = pcaRand.fit_transform(randData_std)
    sklearn_pcaOrg = pcaOrg.fit_transform(orgData_std)

    stratEigVal = pcaStrat.explained_variance_
    randEigVal = pcaRand.explained_variance_
    orgEigVal = pcaOrg.explained_variance_


    sumOfStratEig =0
    sumOfRandEig =0
    sumOfOrgEig =0

    contSumOfStratEig = [None]*10
    contSumOfRandEig = [None]*10
    contSumOfOrgEig = [None]*10

    #calculate sum of all eigenval
    for i in range(0,10):
        sumOfStratEig = stratEigVal[i] + sumOfStratEig
        sumOfRandEig = randEigVal[i] + sumOfRandEig
        sumOfOrgEig = orgEigVal[i] + sumOfOrgEig

        contSumOfStratEig[i] = sumOfStratEig
        contSumOfRandEig[i] = sumOfRandEig
        contSumOfOrgEig[i] = sumOfOrgEig
        
    
    stratVarArray = [None]*10
    randVarArray = [None]*10
    orgVarArray = [None]*10

    #calculate variance array
    for i in range(0,10):
        stratVarArray[i] = stratEigVal[i]/sumOfStratEig
        randVarArray[i] = randEigVal[i]/sumOfRandEig
        orgVarArray[i] = orgEigVal[i]/sumOfOrgEig

    sumStratVar =0
    sumRandVar =0
    sumOrgVar =0

    #get the sum of variances (total variance)
    for i in range(0,10):
        sumStratVar = sumStratVar + stratVarArray[i]
        sumRandVar = sumRandVar + randVarArray[i]
        sumOrgVar = sumOrgVar + orgVarArray[i]

    tempStratVarSum =0
    tempRandVarSum=0
    tempOrgVarSum =0

    stratIntrDimCount =0
    randIntrDimCount =0
    orgIntrDimCount = 0

    #get when 75% of the total variance occured
    for i in range(0,10):
        tempStratVarSum = tempStratVarSum + stratVarArray[i]
        tempRandVarSum = tempRandVarSum + randVarArray[i]
        tempOrgVarSum = tempOrgVarSum + orgVarArray[i]
        if((tempStratVarSum >(sumStratVar*.75))and(stratIntrDimCount==0)):
            stratIntrDimCount = i
        if((tempRandVarSum >(sumRandVar*.75))and(randIntrDimCount==0)):
            randIntrDimCount = i
        if((tempOrgVarSum >(sumOrgVar*.75))and(orgIntrDimCount==0)):
            orgIntrDimCount = i


    #calculate loading factors
    pcaStratNew = decomposition.PCA(n_components=stratIntrDimCount)
    pcaRandNew = decomposition.PCA(n_components=randIntrDimCount)
    pcaOrgNew = decomposition.PCA(n_components=orgIntrDimCount)

    sklearn_pcaStrat = pcaStratNew.fit_transform(stratData_std)
    sklearn_pcaRand = pcaRandNew.fit_transform(randData_std)
    sklearn_pcaOrg = pcaOrgNew.fit_transform(orgData_std)

    stratLoadFact = pcaStratNew.components_.T * np.sqrt(pcaStratNew.explained_variance_)
    randLoadFact = pcaRandNew.components_.T * np.sqrt(pcaRandNew.explained_variance_)
    orgLoadFact = pcaOrgNew.components_.T * np.sqrt(pcaOrgNew.explained_variance_)


    stratSumOfSquaredLoad = [[0 for i in range(0,2)] for j in range(0,10)]
    randSumOfSquaredLoad = [[0 for i in range(0,2)] for j in range(0,10)]
    orgSumOfSquaredLoad = [[0 for i in range(0,2)] for j in range(0,10)]

    #get attributes with highest PCA loading
    for i in range(0,10):
        for j in range(0, stratIntrDimCount):
            stratSumOfSquaredLoad[i] = stratSumOfSquaredLoad[i] + (stratLoadFact[i][j])**2
            stratSumOfSquaredLoad[i][1] = i

    for i in range(0,10):
        for j in range(0, randIntrDimCount):
            randSumOfSquaredLoad[i] = randSumOfSquaredLoad[i] + (randLoadFact[i][j])**2
            randSumOfSquaredLoad[i][1]= i

    for i in range(0,10):
        for j in range(0, orgIntrDimCount):
            orgSumOfSquaredLoad[i] = orgSumOfSquaredLoad[i] + (orgLoadFact[i][j])**2   
            orgSumOfSquaredLoad[i][1]= i   

    #I sort the arrays
    stratSumOfSquaredLoad.sort(key=lambda x: x[0])
    randSumOfSquaredLoad.sort(key=lambda x: x[0])
    orgSumOfSquaredLoad.sort(key=lambda x: x[0])
    

    #I get the highest 3 attributes
    stratThreeHighAttr = np.array(stratSumOfSquaredLoad[-3:])
    randThreeHighAttr = np.array(randSumOfSquaredLoad[-3:])
    orgThreeHighAttr = np.array(orgSumOfSquaredLoad[-3:])

    stratThreeHighAttrData = [[0 for i in range(0,3)] for j in range(0,250)]
    randThreeHighAttrData = [[0 for i in range(0,3)] for j in range(0,250)]
    orgThreeHighAttrData = [[0 for i in range(0,3)] for j in range(0,999)]

    #I get the data associated with the three highest attribtues
    for j in range(0,250):
        for i in range(0,3):
            stratThreeHighAttrData[j][i] = stratData_std[j][int(stratThreeHighAttr[i][1])]
            randThreeHighAttrData[j][i] = randData_std[j][int(randThreeHighAttr[i][1])]
    
    for j in range(0,999):
        for i in range(0,3):
            orgThreeHighAttrData[j][i] = orgData_std[j][int(orgThreeHighAttr[i][1])]
    

    #names of the three highest attributes
    stratColumns =[None]*3
    randColumns = [None]*3
    orgColumns = [None]*3

    for i in range(0,3):
        stratColumns[i] = (attributeNames[int(stratThreeHighAttr[i][1])])
        randColumns[i] = (attributeNames[int(randThreeHighAttr[i][1])])
        orgColumns[i] = (attributeNames[int(orgThreeHighAttr[i][1])])
    
    strat3Data = pd.DataFrame(data = stratThreeHighAttrData, columns = stratColumns)
    rand3Data = pd.DataFrame(data = randThreeHighAttrData, columns = randColumns)
    org3Data = pd.DataFrame(data = orgThreeHighAttrData, columns = orgColumns)

    targetForStrat2 = pd.DataFrame(data=targetForStrat, columns = ['Target'])
    targetForRand2 = pd.DataFrame(data=targetForRand, columns = ['Target'])
    targetForOrg2 = pd.DataFrame(data=targetForOrg, columns = ['Target'])

    #create the array with data points for 3 attr and cluster associated with that
    strat3DataFinal = pd.concat([strat3Data, targetForStrat2[['Target']]], axis=1)
    rand3DataFinal= pd.concat([rand3Data, targetForRand2[['Target']]], axis= 1)
    org3DataFinal = pd.concat([org3Data, targetForOrg2[['Target']]], axis=1)

    #create an array with coordinates for 3 attr scatter plot
    bigStrat3Array = [[0 for i in range(0,9)] for j in range (0,250)]
    bigRand3Array = [[0 for i in range(0,9)] for j in range (0,250)]
    bigOrg3Array = [[0 for i in range(0,9)] for j in range (0,999)]

    for m in range(0,250):
        count =0
        for j in range(0,3):
            for i in range(0,3):
                bigStrat3Array[m][count] = ([strat3DataFinal.values[m][i],strat3DataFinal.values[m][j]])
                bigRand3Array[m][count]=([rand3DataFinal.values[m][i],rand3DataFinal.values[m][j]])
                count = count+1

    for m in range(0,999):
        count =0
        for j in range(0,3):
            for i in range(0,3):
                bigOrg3Array[m][count]=([org3DataFinal.values[m][i],org3DataFinal.values[m][j]])
                count = count +1

    #to visualize data on top 2 pcaVectors
    pcaVisStrat = decomposition.PCA(n_components=2)
    pcaVisRand = decomposition.PCA(n_components=2)
    pcaVisOrg = decomposition.PCA(n_components=2)

    principalDFStrat = pd.DataFrame(data = pcaVisStrat.fit_transform(stratData_std), columns = ['Principal Component 1', 'Principal Component 2'])
    principalDFRand = pd.DataFrame(data = pcaVisRand.fit_transform(randData_std), columns = ['Principal Component 1', 'Principal Component 2'])
    principalDFOrg = pd.DataFrame(data = pcaVisOrg.fit_transform(orgData_std), columns = ['Principal Component 1', 'Principal Component 2'])

    # targetForStrat2 = pd.DataFrame(data=targetForStrat, columns = ['Target'])
    # targetForRand2 = pd.DataFrame(data=targetForRand, columns = ['Target'])
    # targetForOrg2 = pd.DataFrame(data=targetForOrg, columns = ['Target'])
    #print(targetForStrat)
    #last row will show the cluster associated w/ each data point

    finalDFStrat = pd.concat([principalDFStrat, targetForStrat2[['Target']]], axis=1)
    finalDFRand = pd.concat([principalDFRand, targetForRand2[['Target']]], axis= 1)
    finalDFOrg = pd.concat([principalDFOrg, targetForOrg2[['Target']]], axis=1)

    
    #mds
    mds_dataStrat = manifold.MDS(n_components=2, dissimilarity='precomputed')
    mds_dataRand = manifold.MDS(n_components=2, dissimilarity='precomputed')
    mds_dataOrg = manifold.MDS(n_components=2, dissimilarity='precomputed')

    #mds with euclidean
    stratSimEuc = pairwise_distances(stratData_std, metric='euclidean')
    randSimEuc = pairwise_distances(randData_std, metric='euclidean')
    orgSimEuc = pairwise_distances(orgData_std, metric= 'euclidean')

    stratDEuc = mds_dataStrat.fit_transform(stratSimEuc)
    randDEuc = mds_dataRand.fit_transform(randSimEuc)
    orgDEuc = mds_dataOrg.fit_transform(orgSimEuc)

    stratMDSdatEuc = pd.DataFrame(stratDEuc)
    randMDSdatEuc = pd.DataFrame(randDEuc)
    orgMDSdatEuc = pd.DataFrame(orgDEuc)

    finalMDSStratDataEuc = pd.concat([stratMDSdatEuc, targetForStrat2[['Target']]], axis=1)
    finalMDSRandDataEuc = pd.concat([randMDSdatEuc, targetForRand2[['Target']]], axis= 1)
    finalMDSOrgDataEuc = pd.concat([orgMDSdatEuc, targetForOrg2[['Target']]], axis=1)

    #mds with corr
    stratSimCor = pairwise_distances(stratData_std, metric='correlation')
    randSimCor = pairwise_distances(randData_std, metric='correlation')
    orgSimCor = pairwise_distances(orgData_std, metric= 'correlation')

    stratDCor = mds_dataStrat.fit_transform(stratSimCor)
    randDCor = mds_dataRand.fit_transform(randSimCor)
    orgDCor = mds_dataOrg.fit_transform(orgSimCor)

    stratMDSdatCor = pd.DataFrame(stratDCor)
    randMDSdatCor = pd.DataFrame(randDCor)
    orgMDSdatCor = pd.DataFrame(orgDCor)

    finalMDSStratDataCor = pd.concat([stratMDSdatCor, targetForStrat2[['Target']]], axis=1)
    finalMDSRandDataCor = pd.concat([randMDSdatCor, targetForRand2[['Target']]], axis= 1)
    finalMDSOrgDataCor = pd.concat([orgMDSdatCor, targetForOrg2[['Target']]], axis=1)



    #json data --> to export to front end
    data = {}
    data['stratEigVal'] = stratEigVal.tolist()
    data['randEigVal'] = randEigVal.tolist()
    data['orgEigVal'] = orgEigVal.tolist()
    
    data['stratLoadFact'] = stratLoadFact.tolist()
    data['randLoadFact'] = randLoadFact.tolist()
    data['orgLoadFact'] = orgLoadFact.tolist()
    
    data['stratSigNum'] = stratIntrDimCount
    data['randSigNum'] = randIntrDimCount
    data['orgSigNum'] = orgIntrDimCount
    
    data['sumOfStratEig'] = contSumOfStratEig
    data['sumOfRandEig'] = contSumOfRandEig
    data['sumOfOrgEig'] = contSumOfOrgEig

    # data['strat3HighAttr'] = stratThreeHighAttr.tolist()
    # data['rand3HighAttr'] = randThreeHighAttr.tolist()
    # data['org3HighAttr'] = orgThreeHighAttr.tolist()

    data['pca2StratValues'] = np.array(finalDFStrat).tolist()
    data['pca2RandValues'] = np.array(finalDFRand).tolist()
    data['pca2OrgValues'] = np.array(finalDFOrg).tolist()

    data['stratMDSDataEuc'] = np.array(finalMDSStratDataEuc).tolist()
    data['randMDSDataEuc'] = np.array(finalMDSRandDataEuc).tolist()
    data['orgMDSDataEuc'] = np.array(finalMDSOrgDataEuc).tolist()

    data['stratMDSDataCor'] = np.array(finalMDSStratDataCor).tolist()
    data['randMDSDataCor'] = np.array(finalMDSRandDataCor).tolist()
    data['orgMDSDataCor'] = np.array(finalMDSOrgDataCor).tolist()

    data['strat3LoadData'] = np.array(strat3DataFinal).tolist()
    data['rand3LoadData'] = np.array(rand3DataFinal).tolist()
    data['org3LoadData'] = np.array(org3DataFinal).tolist()

    data['strat3AttrNames'] = stratColumns
    data['rand3AttrNames']= randColumns
    data['org3AttrNames'] = orgColumns

    data['bigStrat3Array'] = bigStrat3Array
    data['bigRand3Array'] = bigRand3Array
    data['bigOrg3Array'] = bigOrg3Array

    json_data = json.dumps(data)

    return json_data


    # plt.plot([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], stratEigVal, label="Stratified")
    # plt.plot([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], randEigVal, label="Random")
    # plt.plot([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], orgEigVal, label="Original")
    # plt.legend()
    # plt.xlabel("Component Number")
    # plt.ylabel("Eigenvalue")
    # plt.show()


