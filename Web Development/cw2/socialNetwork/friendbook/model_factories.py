import factory
from faker import Faker
from django.contrib.auth.models import User
from .models import *

faker = Faker()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    first_name = factory.LazyAttribute(lambda obj: faker.first_name())
    last_name = factory.LazyAttribute(lambda obj: faker.last_name())
    username = factory.Sequence(lambda n: f'user{n}@example.com')
    password = factory.PostGenerationMethodCall('set_password', 'password123')

class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Profile

    user = factory.SubFactory(UserFactory)
    date_of_birth = factory.Faker('date_of_birth')
    gender = factory.Faker('random_element', elements=['M', 'F'])

class PostImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PostImage
    image = factory.django.ImageField()

    @factory.post_generation
    def posts(self, create, extracted, **kwargs):
        if not create:
            return
        
        if extracted:
            for post in extracted:
                self.posts.add(post)

class PostCommentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PostComment
    comment = faker.paragraph(nb_sentences=2)
    posted_by = factory.SubFactory(ProfileFactory)

    @factory.post_generation
    def posts(self, create, extracted, **kwargs):
        if not create:
            return
        
        if extracted:
            for post in extracted:
                self.posts.add(post)

class PostLikeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PostLike
    liked = True
    liked_by = factory.SubFactory(ProfileFactory)

    @factory.post_generation
    def posts(self, create, extracted, **kwargs):
        if not create:
            return
        
        if extracted:
            for post in extracted:
                self.posts.add(post)

class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Post
    
    user = factory.SubFactory(ProfileFactory)
    caption = faker.paragraph(nb_sentences=2)
    likes = factory.SubFactory(PostLikeFactory)
    post_image = factory.SubFactory(PostImageFactory)
    comment = factory.SubFactory(PostCommentFactory)

    @factory.post_generation
    def likes(self, create, extracted, **kwargs):
        if not create:
            return
        
        if extracted:
            for post_like in extracted:
                self.likes.add(post_like)
    
    @factory.post_generation
    def comment(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for comment in extracted:
                self.comment.add(comment)

    @factory.post_generation
    def post_image(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for image in extracted:
                self.post_image.add(image)

class FriendsFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Friends
    
    request_from = factory.SubFactory(ProfileFactory)
    request_to = factory.SubFactory(ProfileFactory)
    request_status = factory.Faker('random_element', elements=['Accepted', 'Pending'])

class ChatMessageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ChatMessage

    message_from = factory.SubFactory(ProfileFactory)
    message = faker.paragraph(nb_sentences=1)

class ChatsFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Chats
    
    first_user = factory.SubFactory(ProfileFactory)
    second_user = factory.SubFactory(ProfileFactory)
    chat_messages = factory.SubFactory(ChatMessage)

    @factory.post_generation
    def chat_messages(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for message in extracted:
                self.chat_messages.add(message)
