from django.db import models


# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField("First Name", max_length=255)
    last_name = models.CharField("Last Name", max_length=255)
    password = models.CharField(max_length=64)

    def __str__(self):
        return self.username + ": " + self.first_name + " " + self.last_name
