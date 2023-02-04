from django import template
import datetime
from django.utils.timezone import localtime
from dateutil import tz

register = template.Library()

@register.filter(name='format_date')
def format_date(date_string):
    current_date_time= datetime.datetime.now()
    date_time_difference = current_date_time - datetime.datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S.%fZ')
    
    local_zone = tz.tzlocal()

    # check if days different is it less than 7 days and bigger than 0 day, return number of day
    if date_time_difference.days < 7 and date_time_difference.days>0:
        return str(date_time_difference.days) + ' d' 
    # check if days different is more than 7, return the actual datetime
    elif date_time_difference.days > 7:
        return datetime.datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S.%fZ').astimezone(local_zone).strftime("%d-%m-%Y %H:%M")
    # check if date_time_difference hour is more than 0, return hour
    elif date_time_difference.seconds // 3600 > 0:
        return str(date_time_difference.seconds // 3600) + ' h'
    # check if date_time_difference minute is more than 0, return in minute
    elif (date_time_difference.seconds // 60)%60 > 0:
        return str((date_time_difference.seconds // 60)%60) + ' min'
    # any date_time_difference that is below 1 min from current time return just now
    return 'just now'