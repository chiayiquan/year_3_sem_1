import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from friendbook.models import *
from friendbook.serializers import *

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # set the room name
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        # set the group name
        self.room_group_name = 'chat_%s' % self.room_name

        # add a connection to the room_name and room_group_name
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        # complete handshake
        self.accept()

    def disconnect(self, close_code):
        # close the connection
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        # convert the data received from websocket to json
        text_data_json = json.loads(text_data)
        # get the message
        message = text_data_json['message']
        # get the current room_name
        room_name = self.room_name
        # get the current user
        user = self.scope['user'].username

        # get the user
        user=Profile.objects.get(user=User.objects.get(username=user))

        # get the chat with the current room_name
        chat = Chats.objects.get(room_id=room_name)
        # create a message object and add it to the chat and save it
        chat_message = ChatMessage.objects.create(message=message, message_from=user)
        chat.chat_messages.add(chat_message)
        chat.save()

        # send the data to chat_message function
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'chat_message': ChatMessageSerializer(chat_message).data,
            }
        )

    def chat_message(self, event):
        # get the message, username and room_name which is passed from receive function
        chat_message = event['chat_message']
        

        # broadcast the message to the group
        self.send(text_data=json.dumps({
            'message':chat_message
        }))
