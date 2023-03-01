from collections import OrderedDict
from django import forms

from .models import *
from django.contrib.auth.models import User
from datetime import datetime

from django.core.exceptions import ValidationError
import re

def validate_password(password):
    if len(password) < 8 or not re.search(r'[A-Z]', password) or not re.search(r'[a-z]', password) or not re.search(r'\d', password):
        raise ValidationError('Password must be at least 8 characters long, have 1 uppercase, lowercase and number.', code='weak_password')

class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    confirm_password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password', 'first_name',
                  'last_name', ]
    
    def clean_password(self):
        password = self.cleaned_data.get('password')
        validate_password(password)
        return password
    
    def clean_confirm_password(self):
        password = self.cleaned_data.get('password')
        confirm_password = self.cleaned_data.get('confirm_password')
        print(confirm_password)
        if password and password != confirm_password:
            raise forms.ValidationError("Password and Confirm password don't match", code='password_not_match')
        return confirm_password
    

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
