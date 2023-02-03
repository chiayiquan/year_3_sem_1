from django import template
import datetime

register = template.Library()

@register.filter(name='format_date')
def format_date(date_string):
    return datetime.datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S.%fZ')