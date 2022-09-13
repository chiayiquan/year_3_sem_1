from django.urls import path
from . import views
from . import api

urlpatterns = [
    path('', views.index, name="index"),
    path('login/', views.user_login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.user_logout, name='logout'),
    path('setting/', views.user_settings, name="setting"),
    path('upload/', views.upload, name="upload"),
]
