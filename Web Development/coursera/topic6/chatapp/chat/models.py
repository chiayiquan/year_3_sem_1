from django.db import models


class Message(models.Model):
    message = models.CharField(max_length=256, null=False, blank=False)
    room_name = models.CharField(max_length=256, null=False, blank=False)

    def __str__(self):
        return self.message
