from django.test import TestCase
import json

from .models import *
from django.urls import reverse
from rest_framework.test import APIRequestFactory, APITestCase
from django.contrib.auth.models import User
from .model_factories import * 
from .serializers import *



# Create your tests here.
def tearDown():
    ChatMessageLink.objects.all().delete()
    Chats.objects.all().delete()
    ChatMessage.objects.all().delete()
    Friends.objects.all().delete()
    PostLikeLink.objects.all().delete()
    PostImageLink.objects.all().delete()
    PostCommentLink.objects.all().delete()
    Post.objects.all().delete()
    PostLike.objects.all().delete()
    PostComment.objects.all().delete()
    PostImage.objects.all().delete()
    Profile.objects.all().delete()
    User.objects.all().delete()

class UploadPostTest(APITestCase):
    url = reverse('uploadPost')

    def setUp(self):
        self.user = ProfileFactory.create()

    def tearDown(self):
        tearDown()
    
    def test_upload_post_failure(self):
        data = {
            'caption': 'Test post',
            'images': [
                "data:image/png;base64,iVBORw0KGgoAAAANSrN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
            ]
        }
        self.client.force_authenticate(user=self.user.user)
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Post.objects.count(), 0)

    def test_upload_post_success(self):
        data = {
            'caption': 'Test post',
            'images': [
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
            ]
        }
        self.client.force_authenticate(user=self.user.user)
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Post.objects.count(), 1)
        post = Post.objects.first()
        self.assertEqual(post.user, self.user)
        self.assertEqual(post.caption, data['caption'])
        self.assertEqual(post.post_image.count(), len(data['images']))
    
class GetPostTest(APITestCase):
    url = 'getPost'

    def setUp(self):
        self.user = ProfileFactory.create()
        second_user = ProfileFactory.create()
        third_user = ProfileFactory.create()
        PostFactory.create(user=self.user)
        PostFactory.create(user=self.user)
        PostFactory.create(user=third_user)
        PostFactory.create(user=second_user)
        FriendsFactory.create(request_from=self.user, request_to=third_user, request_status='Accepted')
        FriendsFactory.create(request_from=second_user, request_to=third_user, request_status='Accepted')
        FriendsFactory.create(request_from=second_user, request_to=self.user, request_status='Pending')
    
    def tearDown(self):
        tearDown()

    # get accepted friend post and own post
    def test_get_all_post(self):
        response = self.client.get(reverse(self.url, kwargs={
            'email': 'all'}), format='json',HTTP_Authorization= self.user.user)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Post.objects.count(), 4)

        data = json.loads(response.content)
        self.assertEqual(len(data),3)
    
    def test_missing_username(self):
        response = self.client.get(reverse(self.url, kwargs={
            'email': 'all'}), format='json')
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(len(data), 0)

    def test_retrieve_specific_user_post(self):
        response = self.client.get(reverse(self.url, kwargs={
            'email': self.user.user}), format='json')
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(len(data), 2)

class GetUserTest(APITestCase):
    url = 'getUser'        

    def setUp(self):
        self.user = ProfileFactory.create()
        ProfileFactory.create()
        ProfileFactory.create()

    def tearDown(self):
        tearDown()
    
    def test_get_user_success(self):
        response = self.client.get(reverse(self.url, kwargs={
            'email': self.user.user}), format='json')
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(self.user.user.username, data.get('user').get('username'))
    
    def test_get_user_failure(self):
        response = self.client.get(reverse(self.url, kwargs={
            'email': 'non_existent_email@example.com'}), format='json')
        self.assertEqual(response.status_code, 404)

        data = json.loads(response.content)

class LikePostTest(APITestCase):
    url = reverse('likePost')        

    def setUp(self):
        self.user = ProfileFactory.create()
        self.second_user = ProfileFactory.create()
        self.third_user = ProfileFactory.create()
        self.post = PostFactory.create(user=self.user)
        PostFactory.create(user=self.user)
        PostFactory.create(user=self.second_user)
        PostFactory.create(user=self.third_user)

    def tearDown(self):
        tearDown()
    
    def test_like_post_success(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'postId':self.post.id} , format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Post.objects.get(id=self.post.id).likes.count(), 1)

        self.client.force_authenticate(user=self.second_user.user)

        response = self.client.post(self.url, {'postId':self.post.id} , format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Post.objects.get(id=self.post.id).likes.count(), 2)

        self.client.force_authenticate(user=self.third_user.user)

        response = self.client.post(self.url, {'postId':self.post.id} , format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Post.objects.get(id=self.post.id).likes.count(), 3)

    def test_dislike_post(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'postId':self.post.id} , format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Post.objects.get(id=self.post.id).likes.count(), 1)

        response = self.client.post(self.url, {'postId':self.post.id} , format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Post.objects.get(id=self.post.id).likes.count(), 0)

    def test_like_invalid_post_failure(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'postId':str(uuid.uuid4())} , format='json')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(Post.objects.get(id=self.post.id).likes.count(), 0)

    def test_like_invalid_user_failure(self):
        response = self.client.post(self.url, {'postId': self.post.id} , format='json')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(Post.objects.get(id=self.post.id).likes.count(), 0)

class CommentPostTest(APITestCase):
    url = reverse('commentPost')  

    def setUp(self):
        self.user = ProfileFactory.create()
        self.second_user = ProfileFactory.create()
        self.third_user = ProfileFactory.create()
        self.post = PostFactory.create(user=self.user)
        PostFactory.create(user=self.user)
        PostFactory.create(user=self.second_user)
        PostFactory.create(user=self.third_user)

    def tearDown(self):
        tearDown()

    def test_post_comment_success(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'postId':self.post.id, 'comment':'test comment'} , format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Post.objects.get(id=self.post.id).comment.count(), 1)
        self.assertEqual(Post.objects.get(id=self.post.id).comment.filter(posted_by=self.user).count(), 1)

        self.client.force_authenticate(user=self.second_user.user)

        response = self.client.post(self.url, {'postId':self.post.id, 'comment':'test comment 1'} , format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Post.objects.get(id=self.post.id).comment.count(), 2)
        self.assertEqual(Post.objects.get(id=self.post.id).comment.filter(posted_by=self.second_user).count(), 1)

    def test_comment_invalid_post_failure(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'postId':str(uuid.uuid4()), 'comment':'test comment'} , format='json')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(Post.objects.get(id=self.post.id).comment.count(), 0)

    def test_comment_invalid_user_failure(self):
        response = self.client.post(self.url, {'postId': self.post.id, 'comment':'test comment'} , format='json')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(Post.objects.get(id=self.post.id).comment.count(), 0)


class SendFriendRequestTest(APITestCase):
    url = reverse('sendFriendRequest')  

    def setUp(self):
        self.user = ProfileFactory.create()
        self.second_user = ProfileFactory.create()
        self.third_user = ProfileFactory.create()
    
    def tearDown(self):
        tearDown()
    
    def test_send_friend_request_success(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'friendUsername':self.second_user.user.username} , format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Friends.objects.filter(request_from=self.user, request_to=self.second_user, request_status='Pending').count(), 1)

    def test_send_friend_request_again_success(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'friendUsername':self.second_user.user.username} , format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Friends.objects.filter(request_from=self.user, request_to=self.second_user, request_status='Pending').count(), 1)

        response = self.client.post(self.url, {'friendUsername':self.second_user.user.username} , format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Friends.objects.filter(request_from=self.user, request_to=self.second_user, request_status='Pending').count(), 1)

    def test_send_friend_request_to_self_failure(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'friendUsername':self.user.user.username} , format='json')

        self.assertEqual(response.status_code, 400)

        self.assertEqual(Friends.objects.filter(request_from=self.user, request_to=self.user, request_status='Pending').count(), 0)

    def test_send_request_to_invalid_user_failure(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'friendUsername':'non_existent_email@example.com'} , format='json')

        self.assertEqual(response.status_code, 404)
    
class RejectFriendRequestTest(APITestCase):    
    url = reverse('rejectFriendRequest')  

    def setUp(self):
        self.user = ProfileFactory.create()
        self.second_user = ProfileFactory.create()
        self.third_user = ProfileFactory.create()
        FriendsFactory(request_from=self.user, request_to=self.third_user, request_status='Accepted')
    
    def tearDown(self):
        tearDown()

    def test_reject_friend_request_success(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'friendUsername':self.second_user.user.username} , format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Friends.objects.filter(request_from=self.user, request_to=self.second_user).count(), 0)

        response = self.client.post(self.url, {'friendUsername':self.third_user.user.username} , format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Friends.objects.filter(request_from=self.user, request_to=self.third_user).count(), 0)

    def test_reject_non_existent_user_failure(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'friendUsername':'non_existent_email@example.com'} , format='json')

        self.assertEqual(response.status_code, 404)

class AcceptFriendRequestTest(APITestCase):    
    url = reverse('acceptFriendRequest')  

    def setUp(self):
        self.user = ProfileFactory.create()
        self.second_user = ProfileFactory.create()
        self.third_user = ProfileFactory.create()
        FriendsFactory(request_from=self.second_user, request_to=self.user, request_status='Pending')
        FriendsFactory(request_from=self.user, request_to=self.third_user, request_status='Pending')
    
    def tearDown(self):
        tearDown()

    def test_accept_friend_request_success(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'friendUsername':self.second_user.user.username} , format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Friends.objects.filter(request_from=self.second_user, request_to=self.user, request_status="Accepted").count(), 1)
    
    def test_accept_own_request_failure(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'friendUsername':self.third_user.user.username} , format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Friends.objects.filter(request_from=self.user, request_to=self.third_user, request_status="Pending").count(), 1)
    
    def test_accept_non_existent_user_failure(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.post(self.url, {'friendUsername':'non_existent_email@example.com'} , format='json')

        self.assertEqual(response.status_code, 404)

class GetFriendListTest(APITestCase):    
    url = 'getFriendList'  

    def setUp(self):
        self.user = ProfileFactory.create()
        self.second_user = ProfileFactory.create()
        self.third_user = ProfileFactory.create()
        self.fourth_user = ProfileFactory.create()
        FriendsFactory(request_from=self.second_user, request_to=self.user, request_status='Accepted')
        FriendsFactory(request_from=self.user, request_to=self.third_user, request_status='Pending')
        FriendsFactory(request_from=self.user, request_to=self.fourth_user, request_status='Accepted')
        FriendsFactory(request_from=self.second_user, request_to=self.third_user, request_status='Pending')
        FriendsFactory(request_from=self.second_user, request_to=self.fourth_user, request_status='Accepted')

    def tearDown(self):
        tearDown()

    def test_get_friend_list_success(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.get(reverse(self.url, kwargs={
            'email': self.user.user}), format='json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)

        self.assertEqual(len(data.get('data')),3)
    
    def test_get_non_existent_user_failure(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.get(reverse(self.url, kwargs={
            'email': 'non_existent_email@example.com'}), format='json')

        self.assertEqual(response.status_code, 404)

class SearchUserTest(APITestCase):    
    url = 'searchUser'  

    def setUp(self):
        self.user = ProfileFactory.create(user=UserFactory(first_name='Alan', last_name='Low'))
        ProfileFactory.create(user=UserFactory(first_name='Berry', last_name='Tan'))
        ProfileFactory.create(user=UserFactory(first_name='Caspel', last_name='Wong'))
        ProfileFactory.create(user=UserFactory(first_name='Darren', last_name='Koh'))

    def tearDown(self):
        tearDown()

    def test_search_user_success(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.get(reverse(self.url, kwargs={
            'searchValue': 'rr'}), format='json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)

        self.assertEqual(len(data),2)

        response = self.client.get(reverse(self.url, kwargs={
            'searchValue': 'a'}), format='json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)

        self.assertEqual(len(data),4)

class GetChatTest(APITestCase):    
    url = 'getChat'  

    def setUp(self):
        self.user = ProfileFactory.create(user=UserFactory(first_name='Alan', last_name='Low'))
        self.second_user = ProfileFactory.create()
        self.third_user = ProfileFactory.create()
        self.fourth_user = ProfileFactory.create()
        self.messages = [ChatMessageFactory(message_from=self.user),ChatMessageFactory(message_from=self.second_user),ChatMessageFactory(message_from=self.user),ChatMessageFactory(message_from=self.user),ChatMessageFactory(message_from=self.second_user)]
        self.chat = ChatsFactory.create(first_user=self.user, second_user=self.second_user)
        self.chat.chat_messages.set(self.messages)

        second_chat_messages = [ChatMessageFactory(message_from=self.second_user),ChatMessageFactory(message_from=self.second_user),ChatMessageFactory(message_from=self.fourth_user),ChatMessageFactory(message_from=self.fourth_user),ChatMessageFactory(message_from=self.second_user)]
        second_chat = ChatsFactory.create(first_user=self.fourth_user, second_user=self.second_user)
        second_chat.chat_messages.set(second_chat_messages)

    def tearDown(self):
        tearDown()

    def test_get_chat_success(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.get(reverse(self.url, kwargs={
            'chatUser': self.second_user.user.username}), format='json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)

        self.assertEqual(len(data.get('data').get('chat').get('chat_messages')),5)
        self.assertEqual(str(self.chat.room_id), data.get('data').get('chat').get('room_id'))

    def test_get_non_existent_user_chat_failure(self):
        self.client.force_authenticate(user=self.user.user)

        response = self.client.get(reverse(self.url, kwargs={
            'chatUser': 'non_existent_email@example.com'}), format='json')
        self.assertEqual(response.status_code, 404)
