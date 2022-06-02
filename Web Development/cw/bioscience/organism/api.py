from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import *
from .serializers import *

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework import mixins


class ProteinDetail(mixins.RetrieveModelMixin,
                    generics.GenericAPIView):
    queryset = Protein.objects.all()
    serializer_class = ProteinSerializer
    lookup_field = 'protein_id'

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class CreateProtein(mixins.CreateModelMixin,
                    generics.GenericAPIView):
    serializer_class = CreateProteinSerializer

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class PFamDetail(mixins.RetrieveModelMixin,
                 generics.GenericAPIView):
    queryset = Pfam.objects.all()
    serializer_class = PfamSerializer
    lookup_field = 'domain_id'

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class ProteinList(generics.ListAPIView):
    serializer_class = ListProteinSerializer

    def get_queryset(self):
        return Protein.objects.filter(taxonomy_id=Taxonomy.objects.filter(taxa_id=self.kwargs['taxa_id'])[0])


class PfamsList(generics.ListAPIView):
    serializer_class = ListPfamsSerializer

    def get_queryset(self):
        taxonomy = Taxonomy.objects.filter(taxa_id=self.kwargs['taxa_id'])
        protein = Protein.objects.filter(taxonomy_id__in=taxonomy)
        return Domain.objects.filter(protein__in=protein)


class Coverage(mixins.RetrieveModelMixin, generics.GenericAPIView):
    queryset = Protein.objects.all()
    serializer_class = CoverageSerializer
    lookup_field = 'protein_id'

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
