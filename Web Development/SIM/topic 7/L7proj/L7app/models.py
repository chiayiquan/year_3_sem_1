from django.db import models


class Students(models.Model):
    name = models.CharField(max_length=100)
    alias = models.CharField(max_length=100)

    def __str__(self):
        return self.name
