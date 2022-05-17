from django.urls import path
from . import views

urlpatterns = [
    path('writeData', views.writeData, name='writeData'),
    path('displaySchool', views.displaySchool, name='displaySchool'),
    path('displayPresident', views.diplayPresident, name='displayPresident'),
    path('displayPizza', views.displayPizza, name='displayPizza'),
    path('accessDatabase', views.accessDatabase, name='accessDatabase'),
    path('writeMultipleData', views.writeMultipleData, name='writeMultipleData'),
    path('displayName', views.displayName, name='displayName'),
    path('displayDatabase', views.displayDatabase, name='displayDatabase'),
    path('mycss', views.mycss, name='mycss'),
]
