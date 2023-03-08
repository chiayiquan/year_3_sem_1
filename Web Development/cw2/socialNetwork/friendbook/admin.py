from django.contrib import admin
from django.utils.html import format_html
from .models import *

# Register your models here.
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user',
                    'date_of_birth',
                    'gender',
                    'get_profile_image']
    search_fields = ['user__username']

    def get_profile_image(self, obj):
        return format_html('<img src="{}" width="50"/>'.format(obj.profile_image.url))

class PostLikeInLine(admin.TabularInline):
    model = PostLikeLink

class PostCommentInLine(admin.TabularInline):
    model = PostCommentLink

class PostImageInLine(admin.TabularInline):
    model = PostImageLink

class PostAdmin(admin.ModelAdmin):
    inlines=[PostLikeInLine, PostCommentInLine, PostImageInLine]
    list_display = ['id',
                    'user',
                    'caption',
                    'created_at',
                    'get_likes',
                    'get_post_image',
                    'get_comment']
    search_fields = ['id','user__user__username']

    def get_likes(self, obj):
        return ", ".join([like.liked_by.user.username for like in obj.likes.all()])

    def get_post_image(self, obj):
        html = ''
        for image in obj.post_image.all():
            html += '<img src="{}" width="50"/>'.format(image.image.url)
        return format_html(html)

    def get_comment(self, obj):
        return ", ".join([comment.comment for comment in obj.comment.all()])

class FriendsAdmin(admin.ModelAdmin):
    list_display = ['request_from',
                    'request_to',
                    'request_status']
    search_fields=['request_to__user__username','request_from__user__username','request_status']

class ChatMessagesInLine(admin.TabularInline):
    model = ChatMessageLink
class ChatAdmin(admin.ModelAdmin):
    inlines=[ChatMessagesInLine]
    list_display = ['first_user',
                    'second_user',
                    'room_id',
                    'get_message',]
                
                
    search_fields=['first_user__user__username','second_user__user__username','room_id']

    def get_message(self, obj):
        return str(obj.chat_messages.count())

admin.site.register(Profile,ProfileAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Friends,FriendsAdmin)
admin.site.register(Chats,ChatAdmin)