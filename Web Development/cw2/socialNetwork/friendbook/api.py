from .models import *
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .forms import *

from django.db.models import Q
from rest_framework import generics
from rest_framework import mixins
from django.core.exceptions import ObjectDoesNotExist
    
from rest_framework.authentication import TokenAuthentication
from django.core.files.base import ContentFile
import base64

from django.contrib.auth.hashers import check_password,make_password
from django.contrib.auth import update_session_auth_hash

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

@api_view(['POST'])
def upload_post(request):
    user = None
    try:
        user = Profile.objects.get(user=User.objects.get(username=request.user))
    except ObjectDoesNotExist:
        return Response({'error':"Invalid user"}, status=status.HTTP_404_NOT_FOUND)

    caption = request.data.get('caption')
    images = request.data.get('images')

    new_post = Post.objects.create(user=user, caption=caption)

    for image in images:
        format, imgstr = image.split(';base64,') 
        ext = format.split('/')[-1] 

        file = ContentFile(base64.b64decode(imgstr), name=str(uuid.uuid4()) +"." +ext)
        post_image=PostImage.objects.create(image=file)
        new_post.post_image.add(post_image)
    new_post.save()

    return Response({'data':PostSerializer(new_post).data},status=status.HTTP_200_OK)


@api_view(['POST'])
def like_post(request):
    username=request.user
    post_id = request.data.get('postId')
    like_exist=False
    try:
        user_profile = Profile.objects.get(user = User.objects.get(username=username))
    except ObjectDoesNotExist:
        return Response({'error':"Invalid user"}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        post_id = uuid.UUID(post_id, version=4)
    except ValueError:
        return Response({'error': "Invalid post ID"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        post = Post.objects.get(id=post_id)
    except ObjectDoesNotExist:
        return Response({'error':"Invalid post"}, status=status.HTTP_404_NOT_FOUND)  

    if len(post.likes.all()):
        for like in post.likes.all():
            if like.liked_by == user_profile:
                post.likes.remove(like)
                PostLike.objects.filter(id=like.id).delete()    
                post.save()
                like_exist=True

    if like_exist:
        return Response({'data':{'liked':False, 'likeCount':len(post.likes.all())}}, status=status.HTTP_200_OK)

    # create a default like object
    post_like = PostLike.objects.create(liked=True, liked_by = user_profile)
    post.likes.add(post_like)
    post.save()
    return Response({'data':{'liked':True, 'likeCount':len(post.likes.all())}}, status=status.HTTP_200_OK)
    

@api_view(['POST'])
def post_comment(request):
    username=request.user
    post_id = request.data.get('postId')
    comment = request.data.get('comment')
    user_profile = None

    print(post_id)
    try: 
        user_profile = Profile.objects.get(user = User.objects.get(username=username))
    except ObjectDoesNotExist:
        return Response({'error':"Invalid user"}, status=status.HTTP_404_NOT_FOUND)   
    
    try:
        post_id = uuid.UUID(post_id, version=4)
    except ValueError:
        return Response({'error': "Invalid post ID"}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        post = Post.objects.get(id=post_id)
        post_comment = PostComment.objects.create(comment=comment, posted_by = user_profile)
        post.comment.add(post_comment)
        post.save()
        return Response({'data':{'comment':comment, 'user_profile':ProfileSerializer(user_profile).data, 'num_of_comments':len(post.comment.all())}}, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({'error':"Invalid post"}, status=status.HTTP_404_NOT_FOUND)  
    except Exception as err:
        return Response({'error':"Invalid post"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def send_friend_request(request):
    try:
        request_from = Profile.objects.get(user=User.objects.get(username=request.user))
        request_to = Profile.objects.get(user=User.objects.get(username=request.data.get('friendUsername')))

        request_list = Friends.objects.filter(request_from=request_from, request_to=request_to) | Friends.objects.filter(request_from=request_to, request_to=request_from)
        
        if len(request_list)>0:
            return Response({'data':'Friend request sent'},status=status.HTTP_200_OK)
        
        friend_request = Friends.objects.create(request_from=request_from, request_to=request_to, request_status='Pending' )
        friend_request.save()

        return Response({'data':'Friend request sent'},status=status.HTTP_200_OK)

    except (Profile.DoesNotExist, User.DoesNotExist) as err:
        return Response({'error':"Invalid user"}, status=status.HTTP_404_NOT_FOUND)   

@api_view(['POST'])
def reject_friend_request(request):
    try:
        request_from = Profile.objects.get(user=User.objects.get(username=request.user))
        request_to = Profile.objects.get(user=User.objects.get(username=request.data.get('friendUsername')))

        request_list = Friends.objects.filter(request_from=request_from, request_to=request_to) | Friends.objects.filter(request_from=request_to, request_to=request_from)

        request_list.delete()

        return Response({'data':'Friend has been removed'},status=status.HTTP_200_OK)

    except (Profile.DoesNotExist, User.DoesNotExist) as err:
        return Response({'error':"Invalid user"}, status=status.HTTP_404_NOT_FOUND)   

@api_view(['POST'])
def accept_friend_request(request):
    try:
        request_from = Profile.objects.get(user=User.objects.get(username=request.user))
        request_to = Profile.objects.get(user=User.objects.get(username=request.data.get('friendUsername')))

        request_list = Friends.objects.filter(request_from=request_from, request_to=request_to) | Friends.objects.filter(request_from=request_to, request_to=request_from)

        if(len(request_list)==0):
            return Response({'data':'Invalid request'},status=status.HTTP_404_NOT_FOUND)

        request_list.first.request_status = 'Accepted'

        return Response({'data':'Friend has been accepted'},status=status.HTTP_200_OK)

    except (Profile.DoesNotExist, User.DoesNotExist) as err:
        return Response({'error':"Invalid user"}, status=status.HTTP_404_NOT_FOUND)   