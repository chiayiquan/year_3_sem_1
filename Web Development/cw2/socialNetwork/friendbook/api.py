import binascii
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

from django.core.files.base import ContentFile
import base64


class RetrievePost(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        if self.kwargs['email'] == "all":
            # if the request does not have the username, return None for the get function
            # this should be a json web token however,
            # due to lack of time i did not research how to use json web token in django
            if self.request.headers.get('Authorization') == None:
                return None

            user = None

            try:
                # get user object
                user = Profile.objects.get(user=User.objects.get(
                    username=self.request.headers.get('Authorization')))

            # if user doesn't exist return None for the get function
            except (Profile.DoesNotExist, User.DoesNotExist) as err:
                return None

            # get friends that have accepted user request
            friends = Friends.objects.filter(Q(request_from=user, request_status='Accepted') | Q(
                request_to=user, request_status='Accepted'))

            # get all the user object of friends
            friend_list = [friend.request_to if friend.request_from ==
                           user else friend.request_from for friend in friends]

            # append current user object to list
            friend_list.append(user)

            # get all the post that belonged to the list of user
            return Post.objects.filter(user__in=friend_list)
        else:
            # retrieve the user post
            return Post.objects.filter(user=Profile.objects.get(user=User.objects.get(username=self.kwargs['email'])))

    def get(self, request, email):
        try:
            # serialize the data from get_queryset function, if is None it will return an empty list
            data = PostSerializer(self.get_queryset(), many=True).data
            return Response(data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'error': "Unknown error"}, status=status.HTTP_400_BAD_REQUEST)


class SearchUser(generics.ListAPIView):
    serializer_class = ProfileSerializer

    def get_queryset(self):
        search_value = self.kwargs['searchValue']
        # search for user that contains the searchValue in their first_name and last_name
        users = User.objects.filter(Q(first_name__icontains=search_value) | Q(
            last_name__icontains=search_value))
        # return the profile of the list of user
        return Profile.objects.filter(user__in=users)


class RetrieveUser(mixins.RetrieveModelMixin, generics.GenericAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    # search for username in user field(foreign key)
    lookup_field = 'user__username'
    # url parameter is email
    lookup_url_kwarg = 'email'

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class SendFriendRequest(mixins.CreateModelMixin, generics.GenericAPIView):
    serializer_class = FriendSerializer

    def post(self, request, *args, **kwargs):
        request_from = None
        request_to = None

        # check if friendUsername is the same as the current user username,
        # to prevent them sending request to themselves
        if request.data.get('friendUsername') == request.user.username:
            return Response({'error': "You cannot send friend request to yourself"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # get the user of current user and the targeted user aka friendUsername
            # request_from will be current user
            # request_to will be the targeted user
            request_from = Profile.objects.get(
                user=User.objects.get(username=request.user))
            request_to = Profile.objects.get(user=User.objects.get(
                username=request.data.get('friendUsername')))

        # if user does not exist return 404 error
        except (Profile.DoesNotExist, User.DoesNotExist) as err:
            return Response({'error': "Invalid user"}, status=status.HTTP_404_NOT_FOUND)

        # query where request_from or request_to is current user
        # and request_from or request_to is the recipient user
        query_filter =  Q(request_from=request_from, request_to=request_to) | Q(
                request_from=request_to, request_to=request_from)

        # get the request or create a new request object
        friend_request, created = Friends.objects.filter(query_filter).get_or_create(
            defaults={'request_from': request_from, 'request_to': request_to, 'request_status': 'Pending'}
        )

        # if is not created, meaning friend request already existed, return status 200
        if not created:
            return Response({'error': "Friend request sent"}, status=status.HTTP_200_OK)

        # if created serialize the request and send the data as a response
        serializer = self.get_serializer(friend_request)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RetrieveFriendList(mixins.CreateModelMixin, generics.GenericAPIView):
    serializer_class = FriendSerializer

    def get(self, request, *args, **kwargs):
        username = self.kwargs['email']
        user_profile = None

        # get the user profile(user)
        try:
            user_profile = Profile.objects.get(
                user=User.objects.get(username=username))

        # return error 404 if profile(user) not found
        except ObjectDoesNotExist:
            return Response({'error': "Invalid user"}, status=status.HTTP_404_NOT_FOUND)

        # get from friends table, if request_from or request_to have this user
        # return the list by serializing it and get the data
        friend_list = Friends.objects.filter(
            Q(request_from=user_profile) | Q(request_to=user_profile))
        return Response({'data': FriendSerializer(friend_list, many=True).data}, status=status.HTTP_200_OK)


@api_view(['POST'])
def upload_post(request):
    user = None

    # get the current user
    try:
        user = Profile.objects.get(
            user=User.objects.get(username=request.user))

    # if user doesn't exist return 404 error
    except (Profile.DoesNotExist, User.DoesNotExist) as err:
        return Response({'error': "Invalid user"}, status=status.HTTP_404_NOT_FOUND)

    # get the caption and images(list of base64) from the request
    caption = request.data.get('caption')
    images = request.data.get('images')

    # create a Post object with the user and caption
    new_post = Post.objects.create(user=user, caption=caption)

    # loop through the images
    for image in images:
        # split the base64 into format and the base64 data
        format, imgstr = image.split(';base64,')
        # get the extension type of the file
        ext = format.split('/')[-1]

        # try to store the base64 image into a jpeg/jpg/png file on local disk
        try:
            file = ContentFile(base64.b64decode(imgstr),
                               name=str(uuid.uuid4()) + "." + ext)
        # if file cannot be save/base64 is invalid, return error 400
        except binascii.Error:
            new_post.delete()
            return Response({'error': 'Incorrect padding in base64 string'}, status=status.HTTP_400_BAD_REQUEST)

        # once the file is saved to the local disk, create a PostImage object and set the file as image field value
        post_image = PostImage.objects.create(image=file)

        # add the post_image into the post
        new_post.post_image.add(post_image)

    # once all the image are saved and added to the post, save the post object
    new_post.save()

    # serialize the new post and send it back as response
    return Response({'data': PostSerializer(new_post).data}, status=status.HTTP_200_OK)


@api_view(['POST'])
def like_post(request):
    # get the current user and the postId from request
    username = request.user
    post_id = request.data.get('postId')
    like_exist = False

    # get the current user profile
    try:
        user_profile = Profile.objects.get(
            user=User.objects.get(username=username))

    # return 404 if user not found
    except (Profile.DoesNotExist, User.DoesNotExist) as err:
        return Response({'error': "Invalid user"}, status=status.HTTP_404_NOT_FOUND)

    # check the post id provided are uuid4
    try:
        post_id = uuid.UUID(post_id, version=4)
    # if is not uuid4, return 404
    except ValueError:
        return Response({'error': "Invalid post ID"}, status=status.HTTP_404_NOT_FOUND)

    # get the post
    try:
        post = Post.objects.get(id=post_id)
    # if post doesn't exist return 404
    except Post.DoesNotExist:
        return Response({'error': "Invalid post"}, status=status.HTTP_404_NOT_FOUND)

    # if likes have 1 or more entry
    if len(post.likes.all()) > 0:
        # loop through the like and compare the user who liked this post
        # if there is record of the current user, delete(aka unlike) the record
        for like in post.likes.all():
            if like.liked_by == user_profile:
                post.likes.remove(like)
                PostLike.objects.filter(id=like.id).delete()
                post.save()
                like_exist = True

    # if the like already exist, return the response that it is unliked
    if like_exist:
        return Response({'data': {'liked': False, 'likeCount': len(post.likes.all())}}, status=status.HTTP_200_OK)

    # create a default like object
    post_like = PostLike.objects.create(liked=True, liked_by=user_profile)
    # add the like object into the post and save it
    post.likes.add(post_like)
    post.save()
    return Response({'data': {'liked': True, 'likeCount': len(post.likes.all())}}, status=status.HTTP_200_OK)


@api_view(['POST'])
def post_comment(request):
    # get the current user, post id and comment from request
    username = request.user
    post_id = request.data.get('postId')
    comment = request.data.get('comment')
    user_profile = None

    # get the current user profile
    try:
        user_profile = Profile.objects.get(
            user=User.objects.get(username=username))
    # return 404 if user not found
    except (Profile.DoesNotExist, User.DoesNotExist) as err:
        return Response({'error': "Invalid user"}, status=status.HTTP_404_NOT_FOUND)

    # check the post id provided are uuid4
    try:
        post_id = uuid.UUID(post_id, version=4)
    # if is not uuid4, return 404
    except ValueError:
        return Response({'error': "Invalid post ID"}, status=status.HTTP_400_BAD_REQUEST)

    # get the post
    try:
        post = Post.objects.get(id=post_id)
        # create a comment object
        post_comment = PostComment.objects.create(
            comment=comment, posted_by=user_profile)
        # add the comment into the post
        post.comment.add(post_comment)
        post.save()
        return Response({'data': {'comment': comment, 'user_profile': ProfileSerializer(user_profile).data, 'num_of_comments': len(post.comment.all())}}, status=status.HTTP_200_OK)
    # if post does not exist return 404
    except Post.DoesNotExist:
        return Response({'error': "Invalid post"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as err:
        return Response({'error': "Invalid post"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def reject_friend_request(request):
    request_from = None
    request_to = None

    # get the user profile
    try:
        request_from = Profile.objects.get(
            user=User.objects.get(username=request.user))
        request_to = Profile.objects.get(user=User.objects.get(
            username=request.data.get('friendUsername')))

    # return 404 if user not found
    except (Profile.DoesNotExist, User.DoesNotExist) as err:
        return Response({'error': "Invalid user"}, status=status.HTTP_404_NOT_FOUND)

    try:
        # get the entry
        # if request_from is the current user and request_to is the targeted user
        # or request_from is the targeted user and request_to is the current user
        # delete the record and return 200
        request_list = Friends.objects.filter(Q(request_from=request_from, request_to=request_to) | Q(
            request_from=request_to, request_to=request_from))
        request_list.delete()

        return Response({'data': 'Friend has been removed'}, status=status.HTTP_200_OK)
    # filter most probably won't throw exception error when it return a empty list and did a delete()
    # but put this just in case
    except Friends.DoesNotExist:
        return Response({'error': "Invalid request"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def accept_friend_request(request):
    # get the user profile
    try:
        first_user = Profile.objects.get(
            user=User.objects.get(username=request.user))
        second_user = Profile.objects.get(user=User.objects.get(
            username=request.data.get('friendUsername')))

    # return 404 if user not found
    except (Profile.DoesNotExist, User.DoesNotExist) as err:
        return Response({'error': "Invalid user"}, status=status.HTTP_404_NOT_FOUND)

    # get the entry
    # if request_from is the current user and request_to is the targeted user
    # or request_from is the targeted user and request_to is the current user
    friend_request = Friends.objects.filter(Q(request_from=first_user, request_to=second_user) | Q(
        request_from=second_user, request_to=first_user))

    # if there is no such request, return 404
    if len(friend_request) == 0:
        return Response({'error': 'Invalid request'}, status=status.HTTP_404_NOT_FOUND)

    # if the entry request_from value is current user return 400
    # to prevent the person who send the request accepting the request on the other party behalf
    if friend_request.first().request_from.user == request.user:
        return Response({'error': 'You cannot accept request that you sent'}, status=status.HTTP_400_BAD_REQUEST)

    # set the request status to Accepted and return 200
    friend_request.update(request_status='Accepted')
    return Response({'data': 'Friend request has been accepted'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_chat(request, chatUser):
    # get the user profile
    try:
        first_user = Profile.objects.get(
            user=User.objects.get(username=request.user))
        second_user = Profile.objects.get(
            user=User.objects.get(username=chatUser))

    # return 404 if user not found
    except (Profile.DoesNotExist, User.DoesNotExist) as err:
        return Response({'error': "Invalid user"}, status=status.HTTP_404_NOT_FOUND)

    # get the chat
    # if first_user is the current user and second_user is the targeted user
    # or first_user is the targeted user and second_user is the current user
    chat = Chats.objects.filter(Q(first_user=first_user, second_user=second_user) | Q(
        first_user=second_user, second_user=first_user))

    # if there are no chat record, create a chat object, save it and return 200
    # messages are saved from the websocket so saving a entry in the database here will
    # make websocket code to be neater
    if len(chat) == 0:
        chat_obj = Chats.objects.create(
            first_user=first_user, second_user=second_user)
        chat_obj.save()
        return Response({'data': {'chat': ChatSerializer(chat_obj).data}}, status=status.HTTP_200_OK)

    # return all the chat plus all the messages in the response
    return Response({'data': {'chat': ChatSerializer(chat.first()).data}}, status=status.HTTP_200_OK)
