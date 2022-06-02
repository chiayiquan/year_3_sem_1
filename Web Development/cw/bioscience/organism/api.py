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
