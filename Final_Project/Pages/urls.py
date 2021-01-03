from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('home/', views.home, name='home'),
    path('screePlots/', views.screePlots, name='screePlots'),
    path('pcaDataProjection/', views.pcaDataProjection, name='pcaDataProjection'),
    path('mdsScatterPlots/', views.mdsScatterPlots, name='mdsScatterPlots'),
    path('scatterPlotMatrix/', views.scatterPlotMatrix, name='scatterPlotMatrix')
]