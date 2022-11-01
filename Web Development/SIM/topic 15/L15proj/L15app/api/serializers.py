from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from L15app.models import Post, Comment

class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'description',
            'created_at',
            'updated_at',
        ]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'id',
            'post',
            'message',
            'created_at',
            'updated_at',
        ]
