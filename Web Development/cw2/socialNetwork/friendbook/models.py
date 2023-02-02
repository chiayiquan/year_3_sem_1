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
    online_status = models.BooleanField(default=False)

class PostImage(models.Model):
    image = models.ImageField(upload_to='./friendbook/static/media/post_image')

class Post(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4)
    user = models.CharField(max_length=100)
    caption = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    number_of_likes = models.IntegerField(default=0)
    post_image = models.ManyToManyField(
        PostImage, through='PostImageLink', through_fields=('post', 'post_image'))

    def __str__(self):
        return self.user

class PostImageLink(models.Model):
    post = models.ForeignKey(Post, on_delete=models.DO_NOTHING)
    post_image = models.ForeignKey(PostImage, on_delete=models.DO_NOTHING)

class Friends(models.Model):
    request_from = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="from_user")
    request_to = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="to_user")
    request_status = models.CharField(max_length=10,choices=request_status, null=False, blank=False)