from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class AppUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField(auto_now=False, auto_now_add=False)
    gender = models.CharField(
        max_length=1,
        choices=(
            ("M", "Male"),
            ("F", "Female"),
            ("O", "Other"),
        ),
        null=False,
        blank=False
    )
    profile_image = models.FileField(blank=True)
    online_status = models.BooleanField(default=False)
