from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from .models import L3app, School, Principal
from django.urls import reverse


def writeData(request):
    template = loader.get_template('writeData.html')
    L3appRecord = L3app(name='Yi Quan', hobby='coding')
    L3appRecord.save()
    queryWritten = L3app.objects.all().values()
    context = {
        'queryWritten': queryWritten
    }
    return HttpResponse(template.render(context, request))


def displaySchool(request):
    # ************** create new data *********************
    mei_chin_primary_school = School.objects.create(
        name="Mei Chin Primary School")
    mei_chin_primary_school.save()
    mr_tan = Principal.objects.create(school_id="1", name="Mr Tan")
    mr_tan.save()

    # orchard_primary_school = School.objects.create(
    #     name="Orchard Primary School")
    # orchard_primary_school.save()
    # mr_roger = Principal.objects.create(school_id="2", name="Mr Roger")
    # mr_roger.save()

    # ************** get existing data *********************

    # ************** get pincipal name *********************
    # mei_chin_primary_school = School.objects.get(
    #    name = "Mei Chin Primary School")
    # principalData = mei_chin_primary_school.principal

    # orchard_primary_school = School.objects.get(
    #     name="Orchard Primary School")
    # principalData = orchard_primary_school.principal

    # ************** get school name *********************
    # school_principal = Principal.objects.get(name="Mr Tan")
    # principalData = school_principal.school
    # *******************************************************

    template = loader.get_template('displaySchool.html')
    context = {
        'principalData': principalData
    }
    return HttpResponse(template.render(context, request))
