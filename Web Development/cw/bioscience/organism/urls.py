from django.urls import path
from . import api

urlpatterns = [
    path('api/protein/<str:protein_id>/',
         api.ProteinDetail.as_view(), name='protein_detail_api'),
]
