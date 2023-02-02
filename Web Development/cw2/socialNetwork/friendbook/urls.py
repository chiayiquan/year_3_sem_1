from django.urls import path
from . import views
from . import api

urlpatterns = [
    path('', views.index, name="index"),
    path('login/', views.user_login, name='login'),
    path('register/', views.user_register, name='register'),
    path('logout/', views.user_logout, name='logout'),
    path('setting/', views.user_settings, name="setting"),
    path('profile/<str:user>/', views.user_profile, name="profile"),
    path('upload-post/', views.upload_post, name="upload"),
    path('upload-profile-image/', views.upload_profile_image, name='uploadProfileImage' ),

    path('api/get-post/<str:user>/', api.retrieve_post.as_view(), name='getPost'),
]
