from .models import *
from .serializers import *
# from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.db.models import Q
from rest_framework import generics
from rest_framework import mixins


class retrieve_post(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(user=Profile.objects.get(user=User.objects.get(username=self.kwargs['email'])))
    
    # user = request.user

    # if user.is_authenticated:
    #     # get list of friends of the current user
    #     friends = Friends.objects.filter(Q(request_from = user.id) | Q(request_to=user.id), requset_status='Accepted')
    #     print(friends)
    #     # get post for the current user
    #     #posts = Post.objects.get()

class retrieve_user(mixins.RetrieveModelMixin,generics.GenericAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'user__username'
    lookup_url_kwarg = 'email'

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

class like_post(mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = PostLike.objects.all()
    serializer_class = PostLikeSerializer

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)