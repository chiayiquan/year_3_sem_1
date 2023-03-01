from email import message
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from friendbook.models import *
from friendbook.serializers import *

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        room_name = self.room_name
        user = self.scope['user'].username

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'room_name' : room_name,
                "user":user
            }
        )

    def chat_message(self, event):
        message = event['message']
        username = event['user']
        room_name = event['room_name']
        user=Profile.objects.get(user=User.objects.get(username=username))

        chat = Chats.objects.get(room_id=room_name)
        chat_message = ChatMessage.objects.create(message=message, message_from=user)
        chat.chat_messages.add(chat_message)
        chat.save()

        self.send(text_data=json.dumps({
            'message':ChatMessageSerializer(chat_message).data
        }))
