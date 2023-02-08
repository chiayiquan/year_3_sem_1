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

class PostCommentSerializer(serializers.ModelSerializer):
    posted_by = ProfileSerializer()
    class Meta:
        model = PostComment
        fields = ['comment','posted_by']

class PostLikeSerializer(serializers.ModelSerializer):
    liked_by = ProfileSerializer()
    class Meta:
        model = PostLike
        fields = ['liked','liked_by']

    def create(self):
        post_id = self.initial_data.get('post_id')
        username = self.initial_data.get('username')
        
        user_profile = Profile.objects.get(user = User.objects.get(username=username))
        post = Post.objects.get(id=post_id)

        # create a default like object
        post_like = next(({**like, "liked":not like.liked} for like in post.like if like.liked_by == user_profile),PostLike.objects.create(liked=True, liked_by = user_profile)) 

        post_like.save()
        return post_like


class PostSerializer(serializers.ModelSerializer):
    post_image = PostImageSerializer(many=True)
    likes = PostLikeSerializer(many=True)
    comment = PostCommentSerializer(many=True)
    user=ProfileSerializer()

    class Meta:
        model = Post
        fields = ["id",
                "user",
                "caption",
                "created_at",
                "likes",
                "post_image",
                "comment"]

