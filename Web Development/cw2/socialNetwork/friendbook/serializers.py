from rest_framework import serializers
from .models import *

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['image']

class PostSerializer(serializers.ModelSerializer):
    post_image = PostImageSerializer(many=True)

    class Meta:
        model = Post
        fields = ["id",
                "user",
                "caption",
                "created_at",
                "number_of_likes",
                "post_image"]