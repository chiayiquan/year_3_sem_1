from django.urls import path
from . import views
from django.urls import include,path
from L11app.views import (indexView,postFriend,checkNickName)

urlpatterns=[
    path('', indexView),
    path('post/ajax/friend', postFriend, name='post_friend'),
    path('get/ajax/validate/nickname', checkNickName, name='validate_nickname')
]