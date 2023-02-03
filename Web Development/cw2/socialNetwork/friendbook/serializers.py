from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'last_login']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Profile
        fields=["user",
                "date_of_birth",
                "gender",
                "profile_image",
                "online_status",]

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['image']

class PostSerializer(serializers.ModelSerializer):
    post_image = PostImageSerializer(many=True)
    user=ProfileSerializer()

    class Meta:
        model = Post
        fields = ["id",
                "user",
                "caption",
                "created_at",
                "number_of_likes",
                "post_image"]

