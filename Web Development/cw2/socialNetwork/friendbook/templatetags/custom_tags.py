from django import template
import datetime
from django.utils import timezone
import tzlocal

register = template.Library()


@register.filter(name='format_date')
def format_date(date_string):
    # get the current datetime in utc
    current_date_time = datetime.datetime.utcnow()
    # get the difference of the datetime
    date_time_difference = current_date_time - \
        datetime.datetime.strptime(
            date_string, '%Y-%m-%dT%H:%M:%S.%fZ')

    # get the local timezone
    local_timezone = tzlocal.get_localzone()
    # check if days different is it less than 7 days and bigger than 0 day, return number of day
    if date_time_difference.days < 7 and date_time_difference.days > 0:
        return str(date_time_difference.days) + ' d'
    # check if days different is more than 7, return the actual datetime
    elif date_time_difference.days > 7:
        return datetime.datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S.%fZ').replace(tzinfo=timezone.utc).astimezone(local_timezone).strftime("%d-%m-%Y %H:%M")
    # check if date_time_difference hour is more than 0, return hour
    elif date_time_difference.seconds // 3600 > 0:
        return str(date_time_difference.seconds // 3600) + ' h'
    # check if date_time_difference minute is more than 0, return in minute
    elif (date_time_difference.seconds // 60) % 60 > 0:
        return str((date_time_difference.seconds // 60) % 60) + ' min'
    # any date_time_difference that is below 1 min from current time return just now
    return 'just now'

@register.filter(name='check_if_liked')
def check_if_liked(liked_list, username):
    for like in liked_list:
        # if like is liked by the current user, return like.get('liked')
        if like.get('liked_by').get('user').get('username')==username:
            return like.get('liked')
    # if not found return false
    return False

@register.filter(name='check_if_friend')
def check_if_friend(friend_list, username):
    # loop through friend list
    for friend in friend_list.get('data'):
        # if the user is friend with current user, return the request status with the username
        if friend.get('request_from').get('user').get('username')==username or friend.get('request_to').get('user').get('username')==username:
            return (friend.get('request_status'), friend.get('request_from').get('user').get('username'))
    # if not return false and None
    return (False,None)

@register.filter(name='get_accepted_friend')
def get_accepted_friend(friend_list, username):
    accepted_friend=[]
    # loop through the friend list
    for friend in friend_list.get('data'):
        # if the request_status is accepted
        if friend.get('request_status')=='Accepted':
            # if the request_from user is current user, append request_to user into accepted friend list
            if friend.get('request_from').get('user').get('username')==username:
                accepted_friend.append(friend.get('request_to'))
            # if the request_to user is current user, append request_from user into accepted friend list
            else:
                accepted_friend.append(friend.get('request_from'))
    return accepted_friend