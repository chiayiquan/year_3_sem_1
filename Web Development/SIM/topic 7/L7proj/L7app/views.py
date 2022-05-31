from pyexpat import model
from django.shortcuts import render
from rest_framework import viewsets
from .serializers import StudentsSerializer
from .models import Students


class StudentsViewSet(viewsets.ModelViewSet):
    queryset = Students.objects.all().order_by('name')
    serializer_class = StudentsSerializer
