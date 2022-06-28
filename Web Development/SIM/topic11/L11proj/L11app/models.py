from django.db import models

class Friend(models.Model):
    nick_name = models.CharField(max_length=150, unique=True)
    first_name= models.CharField(max_length=150)
    last_name= models.CharField(max_length=150)
    likes= models.CharField(max_length=300)
    dob=models.DateField(auto_now=False,auto_now_add=False)
    lives_in = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.nick_name