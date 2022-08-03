from django.urls import path
from . import views
from . import api

urlpatterns = [
    path('', views.index, name="index"),
    path('register/', views.register, name='register'),
    path('logout/', views.user_logout, name='logout'),
    path('api/login/', api.user_login, name='login'),
]