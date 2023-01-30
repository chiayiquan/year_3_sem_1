from .models import *
# from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import json

@api_view(['GET'])
def retrieve_post(request):
    user = request.user

    if user.is_authenticated:
        # get friends of the current user
        friends = Friends.objects.get(request_from = user.id and request_status='Accepted')
        # get post for the current user
        posts = Post.objects.get()