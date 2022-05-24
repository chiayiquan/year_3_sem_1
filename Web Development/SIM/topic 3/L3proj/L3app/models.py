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


class President(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return str(self.name)


class Citizen(models.Model):
    president = models.ForeignKey(President, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)

    def __str__(self):
        return str(self.name)


class Topping(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Pizza(models.Model):
    name = models.CharField(max_length=50)
    toppings = models.ManyToManyField(Topping)

    def __str__(self):
        return self.name


class Image(models.Model):
    # have to pip install Pillow
    title = models.CharField(max_length=200)
    image = models.ImageField(null=True, blank=True, upload_to='images')

    def __str__(self):
        return self.title
