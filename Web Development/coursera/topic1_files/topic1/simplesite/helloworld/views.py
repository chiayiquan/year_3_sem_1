from django.shortcuts import render
from django.http import HttpResponse
from .models import *


def index(request):
    response_string = Hello.objects.all()[0]
    return render(request, 'helloworld/index.html', {'data': response_string})


def simple_view(request):
    addresses = Address.objects.all()
    first_address = ''
    resident_name = ''
    if len(addresses):
        first_address = addresses[0]
        resident_name = str(first_address.resident)
    return render(request, "helloworld/simple.html", {'address': first_address, 'name': resident_name})
