from .models import *
from .serializers import *
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status

from django.db.models import Q
from rest_framework import generics
from rest_framework import mixins


class retrieve_post(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(user=self.kwargs['user'])
    
    # user = request.user

    # if user.is_authenticated:
    #     # get list of friends of the current user
    #     friends = Friends.objects.filter(Q(request_from = user.id) | Q(request_to=user.id), requset_status='Accepted')
    #     print(friends)
    #     # get post for the current user
    #     #posts = Post.objects.get()