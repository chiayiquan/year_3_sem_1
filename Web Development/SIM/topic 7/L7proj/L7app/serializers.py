# serializer will turn our Student into a JSON representation so the API will return a JSON object

from rest_framework import serializers
from .models import Students


class StudentsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Students
        fields = ['id', 'name', 'alias']
