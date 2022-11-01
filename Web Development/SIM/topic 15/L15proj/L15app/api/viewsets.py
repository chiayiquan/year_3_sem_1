from rest_framework.viewsets import ModelViewSet

from L15app.models import Post, Comment
from L15app.api.serializers import PostSerializer, CommentSerializer

class PostViewset(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class CommentViewset(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
