from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, HttpResponse
from .models import *
from .forms import *

from django.contrib.auth import login, logout
from django.contrib.auth.hashers import check_password
from django.contrib.auth.decorators import login_required
from django.contrib import messages


def user_login(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        user = User.objects.get(email=email)
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
    else:
        return render(request, 'friendbook/login.html')


def register(request):
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


@login_required(login_url='login/')
def user_settings(request):
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
            except:
                messages.info(request, 'User existed.')
                return redirect('/register/')

        else:
            messages.info(request, 'Form is invalid.')
            return redirect('/register/')

    else:
        current_user = request.user
        print(current_user.id)
        user_profile_data = Profile.objects.get(user_id=current_user.id)
        user_form = UserSettingForm(current_user)
        profile_form = UserSettingProfileForm(user_profile_data)

    return render(request, 'friendbook/setting.html', {'user_form': user_form,
                                                       'profile_form': profile_form
                                                       })


@login_required(login_url='login/')
def upload(request):
    if request.method == 'POST':
        user = request.user.username
        image = request.FILES.get('image_upload')
        caption = request.POST['caption']

        new_post = Post.objects.create(user=user, image=image, caption=caption)
        new_post.save()

    return redirect('/')
