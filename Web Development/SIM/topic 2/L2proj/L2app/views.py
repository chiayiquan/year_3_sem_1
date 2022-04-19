from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse
from django.template import loader


def index(request):
    template = loader.get_template('L2.html')
    return HttpResponse(template.render())


def my_view(request):
    template = loader.get_template('learnVariables.html')
    context = {
        'name': 'Yi Quan'
    }
    return HttpResponse(template.render(context, request))


def my_view(request):
    template = loader.get_template('learnVariables.html')
    context = {
        'name': 'Yi Quan'
    }
    return HttpResponse(template.render(context, request))


def testing_tag(request):
    template = loader.get_template('tags.html')
    context = {
        'greeting': 2,
        'names': ['Ben', 'Jack', 'Susan']
    }
    return HttpResponse(template.render(context, request))
