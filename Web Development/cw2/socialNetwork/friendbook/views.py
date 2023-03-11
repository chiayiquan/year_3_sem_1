from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from .models import *
from .forms import *

from django.contrib.auth import login, logout, update_session_auth_hash
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
import requests

from django.urls import reverse


def user_login(request):
    # if request is post
    if request.method == 'POST':
        # get the email and password
        email = request.POST['email']
        password = request.POST['password']
        try:
            # get the user for that email
            user = User.objects.get(email=email)
            # check the password of the provided by user and the hashed password in database
            if check_password(password, user.password):
                # if user is active status log the user in
                if user.is_active:
                    login(request, user)
                    return HttpResponseRedirect('/')

                # if user is not active, show error message
                else:
                    messages.info(request, 'Your account is disabled.')
                    return redirect('/login/')
            # if password provided is different from the hashed password in database, show error message
            else:
                messages.info(request, 'Email or password is incorrect.')
                return redirect('/login/')
        # if exception is catch during check_password show error message
        except:
            messages.info(request, 'Email or password is incorrect.')
            return redirect('/login/')
    else:
        return render(request, 'friendbook/login.html')


def user_register(request):
    registered = False

    # if request is post
    if request.method == 'POST':
        # get the user form and user profile form
        user_form = UserForm(data=request.POST)
        profile_form = UserProfileForm(data=request.POST)

        # if both form is valid
        if user_form.is_valid() and profile_form.is_valid():
            try:
                # create a user instance but don't save it first
                user = user_form.save(commit=False)
                # set the user instance username as email
                user.username = user.email
                # set the password
                user.set_password(user.password)
                # save the user instance
                user.save()

                # create a profile instance but don't save it first
                profile = profile_form.save(commit=False)
                # set the profile user as user
                profile.user = user
                # save the profile
                profile.save()
                registered = True

            # will throw exception when username already exist
            # show error message
            except:
                messages.info(request, 'User existed.')
                return redirect('/register/')

        # if user form is not valid, loop through the error and display
        elif not user_form.is_valid():
            for field, field_errors in user_form.errors.items():
                messages.info(request, field_errors)
                return redirect('/register/')

        # catch unhandled error that are not caught in the form validation
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
    # username is set in Authorization in header, this is not a good practice but due to lack of time
    # to research on how to use json web token, i decided to use username in this scenario
    headers = {'Authorization': request.user.username}
    post_url = reverse('getPost', args=["all"])

    # call api to retrieve all the post from friends and the current user
    post_result = requests.get(request.build_absolute_uri(
        post_url), headers=headers, params=request.GET)
    print(post_result.json())
    return render(request, 'friendbook/index.html', {'posts': post_result.json()})


@login_required(login_url='login/')
def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/')


@login_required(login_url='../login/')
def user_settings(request):
    # if request is post
    if request.method == 'POST':
        # get current user
        current_user = request.user
        # get current user user profile
        user_profile = Profile.objects.get(user_id=current_user.id)
        # get current user object
        user = User.objects.get(username=current_user.email)
        # convert the form into dict
        post_data = dict(request.POST.items())
        # get the password
        password = post_data.get('password', '')
        # get the new password
        new_password = post_data.get('new_password', '')

        # if password and new password have value
        if len(password.strip()) > 0 and len(new_password.strip()) > 0:
            # check if password have at least 8 char, 1 uppercase,lowercase and number
            # if any of the condition not satisfied, show error
            if len(new_password) < 8 or not re.search(r'[A-Z]', new_password) or not re.search(r'[a-z]', new_password) or not re.search(r'\d', new_password):
                messages.info(request, 'Password must be at least 8 characters long, have 1 uppercase, lowercase and number.',
                              extra_tags="user_profile_form_failure")
                return redirect('/setting/')
            # if current password provided matches the database password, hash the new password and save it to database
            if check_password(password, user.password):
                post_data['password'] = make_password(new_password)

            # if doesn't match show error
            else:
                messages.info(request, 'Current password is incorrect.',
                              extra_tags="user_profile_form_failure")
                return redirect('/setting/')

        # if there is no changes to the password(e.g. password or new_password doesn't have input) set the form password as current user password
        # if is not set, the form will override the current password to empty
        else:
            post_data['password'] = user.password

        # convert the dict form data to form
        user_form = UserSettingForm(
            data={**post_data, "email": current_user.email}, instance=user)
        profile_form = UserSettingProfileForm(
            data=post_data, instance=user_profile)

        # validate the form
        if user_form.is_valid() and profile_form.is_valid():
            try:
                # save the data
                user_form.save()
                user_profile.save()

                # update the session auth hash to prevent user being logged out
                update_session_auth_hash(request, user_form.instance)

                # display success message
                messages.info(request, 'Data has been updated.',
                              extra_tags="user_profile_form_success")
                return redirect('/setting/')
            except Exception as ex:
                # if there are exception caught, display the exception error
                messages.info(
                    request, ex, extra_tags="user_profile_form_failure")
                return redirect('/setting/')

        # if form not valid show error
        else:
            messages.info(request, 'Form is invalid.',
                          extra_tags="user_profile_form_failure")
            return redirect('/setting/')

    else:
        current_user = request.user

        # get the user data
        user_profile_data = Profile.objects.get(user_id=current_user.id)

        # set the user data into form and display it on the page
        user_form = UserSettingForm(user=current_user)
        profile_form = UserSettingProfileForm(profile=user_profile_data)

    return render(request, 'friendbook/setting.html', {'user_form': user_form,
                                                       'profile_form': profile_form
                                                       })


@login_required(login_url='../login/')
def upload_profile_image(request):
    # if is post request
    if request.method == 'POST':
        # if there are file
        if request.FILES.get('profile_image') != None:
            # get the file
            image = request.FILES.get('profile_image')

            # get the user profile and set the profile image to the file provided and save it
            user_profile = Profile.objects.get(user=request.user)
            user_profile.profile_image = image

            user_profile.save()

            # display success message
            messages.success(request, 'File Uploaded',
                             extra_tags="upload_profile_pic_success")
            return redirect('/setting/')

        # if there is no file provided, show error
        else:
            messages.info(request, 'Cannot upload empty file',
                          extra_tags="upload_profile_pic_failed")
            return redirect('/setting/')


def user_profile(request, email):
    # get the user post from getPost api
    post_url = reverse('getPost', args=[email])
    post_result = requests.get(
        request.build_absolute_uri(post_url), params=request.GET)

    # get the user data with email
    user_url = reverse('getUser', args=[email])
    user_result = requests.get(
        request.build_absolute_uri(user_url), params=request.GET)

    # get the friend list of the user with email
    get_friends_url = reverse('getFriendList', args=[email])
    friend_list = requests.get(request.build_absolute_uri(
        get_friends_url), params=request.GET)

    # display the information on the profile page
    return render(request, 'friendbook/profile.html', {'posts': post_result.json(), 'user_profile': user_result.json(), 'friend_list': friend_list.json()})


def chat(request):
    return render(request, 'friendbook/chat.html')
