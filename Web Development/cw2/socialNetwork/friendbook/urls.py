from django.urls import path
from . import views
from . import api

from drf_yasg import openapi
from drf_yasg.views import get_schema_view as swagger_get_schema_view

schema_view = swagger_get_schema_view(
    openapi.Info(
        title = "API",
        default_version="1.0.0",
        description="API documentation for friendbook"
    ),
    public=True
)

urlpatterns = [
    path('', views.index, name="index"),
    path('login/', views.user_login, name='login'),
    path('register/', views.user_register, name='register'),
    path('logout/', views.user_logout, name='logout'),
    path('setting/', views.user_settings, name="setting"),
    path('profile/<str:email>/', views.user_profile, name="profile"),
    path('upload-profile-image/', views.upload_profile_image, name='uploadProfileImage'),
    path('chat/', views.chat, name='chat'),

    path('api/get-post/<str:email>/', api.RetrievePost.as_view(), name='getPost'),
    path('api/get-user/<str:email>/', api.RetrieveUser.as_view(), name='getUser'),
    path('api/upload-post/', api.upload_post, name="uploadPost"),
    path('api/like-post/', api.like_post, name="likePost"),
    path('api/comment-post/',api.post_comment, name="commentPost"),
    path('api/sent-friend-request/', api.SendFriendRequest.as_view(), name="sendFriendRequest"),
    path('api/reject-friend-request/', api.reject_friend_request, name="rejectFriendRequest"),
    path('api/accept-friend-request/', api.accept_friend_request, name="acceptFriendRequest"),
    path('api/get-friend-list/<str:email>', api.RetrieveFriendList.as_view(), name='getFriendList'),
    path('api/search-user/<str:searchValue>', api.SearchUser.as_view(), name='searchUser'),  
    path('api/get-chat/<str:chatUser>', api.get_chat, name="getChat"),
    path('api/swagger/', schema_view.with_ui('swagger',cache_timeout=0),name="swagger-schema"),
]
