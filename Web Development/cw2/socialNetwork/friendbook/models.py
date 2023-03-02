from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

gender_choice=(
            ("M", "Male"),
            ("F", "Female"),
            ("O", "Other"),
        )

request_status=( ('Accepted','Accepted'), ('Declined','Declined'), ('Pending','Pending'))
# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField(auto_now=False, auto_now_add=False)
    gender = models.CharField(
        max_length=1,
        choices=gender_choice,
        null=False,
        blank=False
    )
    profile_image = models.ImageField(
        upload_to='./friendbook/static/media/profile_images', default='./friendbook/static/media/default_picture.png')

class PostImage(models.Model):
    image = models.ImageField(upload_to='./friendbook/static/media/post_image')

class PostComment(models.Model):
    comment = models.CharField(
        max_length=10000,
        null=False,
        blank=False
    )
    posted_by = models.ForeignKey(Profile, on_delete=models.DO_NOTHING)

class PostLike(models.Model):
    liked = models.BooleanField()
    liked_by = models.ForeignKey(Profile, on_delete=models.DO_NOTHING)


class Post(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4)
    user = models.ForeignKey(Profile, on_delete=models.DO_NOTHING)
    caption = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    likes = models.ManyToManyField(
        PostLike, through='PostLikeLink', through_fields=('post', 'likes'))
    post_image = models.ManyToManyField(
        PostImage, through='PostImageLink', through_fields=('post', 'post_image'))
    comment = models.ManyToManyField(
        PostComment, through='PostCommentLink', through_fields=('post', 'comment'))

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.user

class PostCommentLink(models.Model):
    post = models.ForeignKey(Post, on_delete=models.DO_NOTHING)
    comment = models.ForeignKey(PostComment, on_delete=models.DO_NOTHING)

class PostImageLink(models.Model):
    post = models.ForeignKey(Post, on_delete=models.DO_NOTHING)
    post_image = models.ForeignKey(PostImage, on_delete=models.DO_NOTHING)

class PostLikeLink(models.Model):
    post = models.ForeignKey(Post, on_delete=models.DO_NOTHING)
    likes = models.ForeignKey(PostLike, on_delete=models.CASCADE)

class Friends(models.Model):
    request_from = models.ForeignKey(Profile, on_delete=models.DO_NOTHING, related_name="from_user")
    request_to = models.ForeignKey(Profile, on_delete=models.DO_NOTHING, related_name="to_user")
    request_status = models.CharField(max_length=10,choices=request_status, null=False, blank=False)

class ChatMessage(models.Model):
    message = models.CharField(
        max_length=10000,
        null=False,
        blank=False
    )
    message_from = models.ForeignKey(Profile, on_delete=models.DO_NOTHING)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['created_at']


class Chats(models.Model):
    first_user = models.ForeignKey(Profile, on_delete=models.DO_NOTHING, related_name="first_user")
    second_user = models.ForeignKey(Profile, on_delete=models.DO_NOTHING, related_name="second_user")
    room_id = models.UUIDField(default=uuid.uuid4,null=False,blank=False)
    chat_messages = models.ManyToManyField(ChatMessage, through='ChatMessageLink', through_fields=('chat', 'message'))

class ChatMessageLink(models.Model):
    chat = models.ForeignKey(Chats, on_delete=models.DO_NOTHING)
    message = models.ForeignKey(ChatMessage, on_delete=models.DO_NOTHING)
