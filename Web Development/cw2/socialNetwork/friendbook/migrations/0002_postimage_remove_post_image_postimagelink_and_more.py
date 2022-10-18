# Generated by Django 4.0.6 on 2022-10-11 06:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('friendbook', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PostImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='post_image')),
            ],
        ),
        migrations.RemoveField(
            model_name='post',
            name='image',
        ),
        migrations.CreateModel(
            name='PostImageLink',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='friendbook.post')),
                ('postImage', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='friendbook.postimage')),
            ],
        ),
        migrations.AddField(
            model_name='post',
            name='postImage',
            field=models.ManyToManyField(through='friendbook.PostImageLink', to='friendbook.postimage'),
        ),
    ]
