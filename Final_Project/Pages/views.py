from django.shortcuts import render

from . import Task2
from . import ReadCSVFiles
from . import combinedData

# import Task2
# import ReadCSVFiles
# import combinedData

# Create your views here.
data = Task2.myfunction()
additionalData = ReadCSVFiles.getAllData()
newCombinedData = combinedData.myfunction()
# print(newCombinedData)

context = {'data': data, 'additionalData': additionalData, 'newCombinedData': newCombinedData}



def home(request):
    return render(request, "Home.html", context)

def screePlots(request):
    return render(request, "ScreePlots.html", context)

def pcaDataProjection(request):
    return render(request, "PCADataProjection.html", context)

def mdsScatterPlots(request):
    return render(request, 'MDSScatterPlots.html', context)

def scatterPlotMatrix(request):
    return render(request, 'ScatterPlotMatrix.html', context)