from django import forms

from .models import *
from django.contrib.auth.models import User
import datetime


class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name',
                  'last_name', ]


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = AppUser
        fields = [
            'date_of_birth',
            'gender'
        ]
        widgets = {
            'date_of_birth': forms.SelectDateWidget(years=reversed(range(1900, datetime.date.today().year)))
        }
