from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from .models import *
from .forms import *

from django.contrib.auth import login, logout
from django.contrib.auth.hashers import check_password
from django.contrib.auth.decorators import login_required


@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/')


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
                return HttpResponse('Your account is disabled')
        else:
            return HttpResponse('Invalid login')
    else:
        return render(request, 'friendbook/login.html')


def register(request):
    registered = False

    if request.method == 'POST':
        user_form = UserForm(data=request.POST)
        profile_form = UserProfileForm(data=request.POST)

        if user_form.is_valid() and profile_form.is_valid():
            user = user_form.save(commit=False)
            user.username=user.email
            user.set_password(user.password)
            user.save()

            profile = profile_form.save(commit=False)
            profile.user = user
            registered = True

    else:
        user_form = UserForm()
        profile_form = UserProfileForm()

    return render(request, 'friendbook/register.html', {'user_form': user_form,
                                                        'profile_form': profile_form,
                                                        'registered': registered,
                                                        })
