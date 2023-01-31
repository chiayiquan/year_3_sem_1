from .models import *
# from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import json
from django.db.models import Q

@api_view(['GET'])
def retrieve_post(request):
    user = request.user

    if user.is_authenticated:
        # get list of friends of the current user
        friends = Friends.objects.filter(Q(request_from = user.id) | Q(request_to=user.id), requset_status='Accepted')
        print(friends)
        # get post for the current user
        #posts = Post.objects.get()