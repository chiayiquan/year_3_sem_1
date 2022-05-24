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
    path('addData', views.addData, name='addData'),
    path('addRecord', views.addRecord, name='addRecord'),
    path('deleteData', views.deleteData, name='deleteData'),
    path('deleteRecord/<int:id>', views.deleteRecord, name='deleteRecord'),
    path('updateData/', views.updateData, name='updateData'),
    path('updateRecord/<int:id>', views.updateRecord, name='updateRecord'),
    path('updateRecordConfirmation/<int:id>',
         views.updateRecordConfirmation, name='updateRecordConfirmation'),
    path('upload/', views.image_upload_view),
]
