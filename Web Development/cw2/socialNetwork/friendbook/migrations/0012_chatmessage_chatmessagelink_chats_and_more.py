# Generated by Django 4.0.6 on 2023-02-20 07:43

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('friendbook', '0011_alter_friends_request_from_alter_friends_request_to'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatMessage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(max_length=10000)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('message_from', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='friendbook.profile')),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='ChatMessageLink',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Chats',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chat_messages', models.ManyToManyField(through='friendbook.ChatMessageLink', to='friendbook.chatmessage')),
                ('first_user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='first_user', to='friendbook.profile')),
                ('second_user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='second_user', to='friendbook.profile')),
            ],
        ),
        migrations.AddField(
            model_name='chatmessagelink',
            name='chat',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='friendbook.chats'),
        ),
        migrations.AddField(
            model_name='chatmessagelink',
            name='message',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='friendbook.chatmessage'),
        ),
    ]
