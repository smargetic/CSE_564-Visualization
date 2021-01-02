from django.shortcuts import render

from . import Task2

# Create your views here.
data = Task2.myfunction()
context = {'data': data}

def home(request):
    #data = Task2.myfunction()
    # title = 'Home'
    return render(request, "Home.html")

def screePlots(request):
    # data = Task2.myfunction()
    # #print(data)
    # context = {'data': data}
    return render(request, "ScreePlots.html", context)

def pcaDataProjection(request):
    # data = Task2.myfunction()
    # context = {'data': data}
    return render(request, "PCADataProjection.html", context)

def mdsScatterPlots(request):
    # data = Task2.myfunction()
    # context = {'data': data}
    return render(request, 'MDSScatterPlots.html', context)

def scatterPlotMatrix(request):
    return render(request, 'ScatterPlotMatrix.html', context)