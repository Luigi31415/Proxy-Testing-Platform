from django.db import models
from users.models import User

class Proxy(models.Model):
    ip = models.CharField(max_length=255)
    port = models.CharField(max_length=255)
    status = models.CharField(
        max_length=255,
        choices=[("DOWN","Down"), ("UP", "Up")],
        default="Down",
    )
    last_checked = models.DateTimeField(null=True)
    owner = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return self.ip+":"+self.port