import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import *
from asgiref.sync import sync_to_async
from django.core import serializers


@sync_to_async
def get_messages(room_group_name):
    message = Message.objects.defer('id', 'room_name').only('message').filter(
        room_name=room_group_name)
    return serializers.serialize('json', message)


@sync_to_async
def save_message(message, room_group_name):
    message_obj = Message.objects.create(
        room_name=room_group_name, message=message)
    message_obj.save()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        messages = await get_messages(self.room_group_name)
        for message in json.loads(messages):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message['fields']['message']
                }
            )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        await save_message(message, self.room_group_name)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))
