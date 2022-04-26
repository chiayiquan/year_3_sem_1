from django.urls import path
from . import views

urlpatterns = [
    path('writeData', views.writeData, name='writeData'),
    path('displaySchool', views.displaySchool, name='displaySchool')
]
