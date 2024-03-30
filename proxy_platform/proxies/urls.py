from django.urls import path

from . import views

urlpatterns = [
    path("", views.manageProxy.as_view(), name="manage"),
    # path("/test", views.Login.as_view(), name="test"),
]
