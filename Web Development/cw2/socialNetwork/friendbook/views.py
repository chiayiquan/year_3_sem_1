from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from .models import *
from .forms import *

from django.contrib.auth import login, logout,update_session_auth_hash
from django.contrib.auth.hashers import check_password,make_password
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
import json
import base64
import uuid
from django.core.files.base import ContentFile


def user_login(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        try:
            user = User.objects.get(email=email)
            print(user)
            if check_password(password, user.password):
                if user.is_active:
                    login(request, user)
                    return HttpResponseRedirect('/')

                else:
                    messages.info(request, 'Your account is disabled.')
                    return redirect('/login/')
            else:
                messages.info(request, 'Email or password is incorrect.')
                return redirect('/login/')
        except:
            messages.info(request, 'Email or password is incorrect.')
            return redirect('/login/')
    else:
        return render(request, 'friendbook/login.html')


def user_register(request):
    registered = False

    if request.method == 'POST':
        user_form = UserForm(data=request.POST)
        profile_form = UserProfileForm(data=request.POST)

        if user_form.is_valid() and profile_form.is_valid():
            try:
                user = user_form.save(commit=False)
                user.username = user.email
                user.set_password(user.password)
                user.save()

                profile = profile_form.save(commit=False)
                profile.user = user
                profile.save()
                registered = True
            except:
                messages.info(request, 'User existed.')
                return redirect('/register/')

        else:
            messages.info(request, 'Form is invalid.')
            return redirect('/register/')

    else:
        user_form = UserForm()
        profile_form = UserProfileForm()

    return render(request, 'friendbook/register.html', {'user_form': user_form,
                                                        'profile_form': profile_form,
                                                        'registered': registered,
                                                        })


@login_required(login_url='login/')
def index(request):
    return render(request, 'friendbook/index.html')


@login_required(login_url='login/')
def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/')


@login_required(login_url='../login/')
def user_settings(request):
    if request.method == 'POST':
        current_user = request.user
        user_profile=Profile.objects.get(user_id=current_user.id)
        user = User.objects.get(username=current_user.email)
        post_data=dict(request.POST.items())
        if len(post_data.get('password',''))>0:
                if check_password(post_data.get('password',''),user.password):
                    if len(post_data.get('new_password',''))==0:
                        messages.info(request, 'New password cannot be empty.',extra_tags="user_profile_form_failure")
                        return redirect('/setting/') 
                    post_data['password']=make_password(post_data.get('new_password',''))
                else:
                    messages.info(request, 'Current password is incorrect.',extra_tags="user_profile_form_failure")
                    return redirect('/setting/') 

        else:
            post_data['password']=user.password

        user_form=UserSettingForm(data={**post_data,"email":current_user.email},instance=user)
        profile_form=UserSettingProfileForm(data=post_data,instance=user_profile)

        if user_form.is_valid() and profile_form.is_valid():
            try:
                user_form.save()
                user_profile.save()
                update_session_auth_hash(request,user_form.instance)

                messages.info(request, 'Data has been updated.',extra_tags="user_profile_form_success")
                return redirect('/setting/')
            except Exception as ex:
                messages.info(request, ex,extra_tags="user_profile_form_failure")
                return redirect('/setting/')

        else:
            messages.info(request, 'Form is invalid.',extra_tags="user_profile_form_failure")
            return redirect('/setting/')

    else:
        current_user = request.user
        user_profile_data = Profile.objects.get(user_id=current_user.id)
        user_form = UserSettingForm(user=current_user)
        profile_form = UserSettingProfileForm(profile=user_profile_data)


    return render(request, 'friendbook/setting.html', {'user_form': user_form,
                                                       'profile_form': profile_form
                                                       })

@login_required(login_url='../login/')
def upload_profile_image(request):
    if request.method == 'POST':
        if request.FILES.get('profile_image')!=None:
            image=request.FILES.get('profile_image')

            user_profile=Profile.objects.get(user=request.user)
            user_profile.profile_image=image

            user_profile.save()

            messages.success(request, 'File Uploaded',extra_tags="upload_profile_pic_success")
            return redirect('/setting/')
        else:
            messages.info(request, 'Cannot upload empty file',extra_tags="upload_profile_pic_failed")
            return redirect('/setting/')
            

@login_required(login_url='login/')
#@parser_classes([MultiPartParser])
def upload_post(request):
    if request.method == 'POST':
        user = request.user.username
        data=json.loads(request.body)
        caption = data.get('caption')
        images = data.get('images')

        new_post = Post.objects.create(user=user, caption=caption)

        for image in images:
            format, imgstr = image.split(';base64,') 
            ext = format.split('/')[-1] 

            file = ContentFile(base64.b64decode(imgstr), name=str(uuid.uuid4()) + ext)
            post_image=PostImage.objects.create(image=file)
            new_post.post_image.add(post_image)
        new_post.save()

    return redirect('/')

