from django import forms

from .models import *
from django.contrib.auth.models import User
from datetime import datetime


class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name',
                  'last_name', ]


class UserProfileForm(forms.ModelForm):
    years = range(1930, datetime.now().year)[::-1]
    date_of_birth = forms.DateField(
        widget=forms.SelectDateWidget(years=years))

    class Meta:
        model = Profile
        fields = [
            'date_of_birth',
            'gender'
        ]


class UserSettingForm(forms.ModelForm):
    def __init__(self, userData, *args, **kwargs):
        super(UserSettingForm, self).__init__(*args, **kwargs)
        self.fields['password'] = forms.CharField(widget=forms.PasswordInput())
        self.fields['password'].label = "Current password"
        self.fields['email'] = forms.CharField(widget=forms.TextInput(
            attrs={'disabled': True}), initial=userData.email)
        self.fields['first_name'] = forms.CharField(widget=forms.TextInput(
        ), initial=userData.first_name)
        self.fields['last_name'] = forms.CharField(widget=forms.TextInput(
        ), initial=userData.last_name)

    class Meta:
        model = User
        fields = ['email',  'first_name',
                  'last_name', 'password', ]


class UserSettingProfileForm(forms.ModelForm):
    def __init__(self, profileData, *args, **kwargs):
        super(UserSettingProfileForm, self).__init__(*args, **kwargs)
        years = range(1930, datetime.now().year)[::-1]
        self.fields['date_of_birth'] = forms.DateField(
            widget=forms.SelectDateWidget(years=years), initial=profileData.date_of_birth)
        self.base_fields['gender'].initial = profileData.gender

    profile_image = forms.ImageField(widget=forms.FileInput)

    class Meta:
        model = Profile
        fields = [
            'date_of_birth',
            'gender',
            'profile_image'
        ]
