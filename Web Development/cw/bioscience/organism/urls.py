from django.urls import path
from . import api

urlpatterns = [
    path('api/protein/', api.CreateProtein.as_view(), name='create_protein_api'),
    path('api/protein/<str:protein_id>/',
         api.ProteinDetail.as_view(), name='protein_detail_api'),
    path('api/pfam/<str:pfam_id>/',
         api.PFamDetail.as_view(), name='pfam_detail_api'),
    path('api/proteins/<int:taxa_id>/',
         api.ProteinList.as_view(), name='proteins_api'),
    path('api/pfams/<int:taxa_id>/',
         api.PfamsList.as_view(), name='pfams_api'),
    path('api/coverage/<str:protein_id>/',
         api.coverage, name='coverage_api'),
]
