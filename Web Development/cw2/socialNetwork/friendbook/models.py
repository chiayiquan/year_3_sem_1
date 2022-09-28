from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

gender_choice=(
            ("M", "Male"),
            ("F", "Female"),
            ("O", "Other"),
        )
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


class Post(models.Model):
    body = models.TextField()
    user = models.CharField(max_length=100)
    image = models.ImageField(upload_to='post_image')
    caption = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    number_of_likes = models.IntegerField(default=0)

    def __str__(self):
        return self.user
