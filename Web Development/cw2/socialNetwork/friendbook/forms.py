from collections import OrderedDict
from django import forms

from .models import *
from django.contrib.auth.models import User
from datetime import datetime

from django.core.exceptions import ValidationError
import re

# check if password have at least 8 char, 1 uppercase,lowercase and number
# if any of the condition not satisfied, raise error
def validate_password(password):
    if len(password) < 8 or not re.search(r'[A-Z]', password) or not re.search(r'[a-z]', password) or not re.search(r'\d', password):
        raise ValidationError('Password must be at least 8 characters long, have 1 uppercase, lowercase and number.', code='weak_password')

class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    # add a confirm_password field
    confirm_password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password', 'first_name',
                  'last_name', ]
    
    # override the built in function to validate the password criteria
    def clean_password(self):
        password = self.cleaned_data.get('password')
        validate_password(password)
        return password
    
    # add custom function as confirm_password field are not in the User model
    # check password and confirm password are the same else raise error
    def clean_confirm_password(self):
        password = self.cleaned_data.get('password')
        confirm_password = self.cleaned_data.get('confirm_password')
        if password and password != confirm_password:
            raise forms.ValidationError("Password and Confirm password don't match", code='password_not_match')
        return confirm_password
    

class UserProfileForm(forms.ModelForm):
    # reverse the year to show the latest year first
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
        # remove the user key from kwargs
        user = kwargs.pop('user', None)
        # override the forms.ModelForm to setup widget
        super(UserSettingForm, self).__init__(*args, **kwargs)

        # create password field
        self.fields['password'] = forms.CharField(widget=forms.PasswordInput())
        self.fields['password'].label = "Current password"
        self.fields['password'].required = False

        # create email,first name and last_name field
        self.fields['email'] = forms.CharField(widget=forms.TextInput())
        self.fields['first_name'] = forms.CharField(widget=forms.TextInput(
        ))
        self.fields['last_name'] = forms.CharField(widget=forms.TextInput(
        ))

        # if user is not None and is instance of the User 
        # set the email value and disable the field 
        # display the first name value
        # display the last name value
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
        # remove the profile key from kwargs
        profile = kwargs.pop('profile', None)

        # override the forms.ModelForm to setup widget
        super(UserSettingProfileForm, self).__init__(*args, **kwargs)

        # set the earliest year to display first
        years = range(1930, datetime.now().year)[::-1]
        self.fields['date_of_birth'] = forms.DateField(
            widget=forms.SelectDateWidget(years=years))
        
        # set the select value for gender
        self.fields['gender']=forms.CharField(max_length=1,widget=forms.Select(choices= gender_choice))
        
        # if profile is not None and is instance of the Profile 
        # display the preselect the date of birth value
        # display the preselect the gender value
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
