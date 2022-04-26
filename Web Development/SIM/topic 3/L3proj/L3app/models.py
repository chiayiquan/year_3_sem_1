from django.db import models
from django.contrib.auth.models import User


class L3app(models.Model):
    name = models.CharField(max_length=255)
    hobby = models.CharField(max_length=255)


class School(models.Model):
    name = models.CharField(max_length=70)

    def __str__(self):
        return str(self.name)


class Principal(models.Model):
    school = models.OneToOneField(
        School,
        on_delete=models.CASCADE,
        primary_key=True,
    )

    name = models.CharField(max_length=70)

    def __str__(self):
        return str(self.name)
