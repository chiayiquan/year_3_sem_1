from django.urls import path
from . import views

urlpatterns = [
    path('/tag', views.testing_tag, name="tag"),
    path('/index', views.index, name="index"),
    path('', views.my_view, name="my_view"),
]
