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
    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super(UserSettingForm, self).__init__(*args, **kwargs)
        self.fields['password'] = forms.CharField(widget=forms.PasswordInput())
        self.fields['password'].label = "Current password"
        self.fields['password'].required = False
        self.fields['email'] = forms.CharField(widget=forms.TextInput())
        self.fields['first_name'] = forms.CharField(widget=forms.TextInput(
        ))
        self.fields['last_name'] = forms.CharField(widget=forms.TextInput(
        ))
        if user!=None and user:
            if isinstance(user,User):
                self.fields['email'].disabled='disabled'
                self.fields['email'].initial=user.email
                self.fields['first_name'].initial=user.first_name
                self.fields['last_name'].initial=user.last_name



    class Meta:
        model = User
        fields = ['email',  'first_name',
                  'last_name', 'password', ]


class UserSettingProfileForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        profile = kwargs.pop('profile', None)
        super(UserSettingProfileForm, self).__init__(*args, **kwargs)
        years = range(1930, datetime.now().year)[::-1]
        self.fields['date_of_birth'] = forms.DateField(
            widget=forms.SelectDateWidget(years=years))
        self.fields['gender']=forms.CharField(max_length=1,widget=forms.Select(choices= gender_choice))

        if profile is not None and profile:
            if isinstance(profile,Profile):
                self.fields['date_of_birth'].initial=profile.date_of_birth
                self.fields['gender'].initial=profile.gender

    class Meta:
        model = Profile
        fields = [
            'date_of_birth',
            'gender',
        ]
