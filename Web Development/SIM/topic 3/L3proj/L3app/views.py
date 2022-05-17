from curses.panel import new_panel
from re import template
from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from .models import Citizen, L3app, Pizza, President, School, Principal, Topping
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


def diplayPresident(request):
    new_president = President.objects.create(id=1, name="Wee Kim Wee")
    new_president.save()

    new_citizen = Citizen.objects.create(id=1, president_id=1, name="Jovi")
    new_citizen.save()

    citizenData = Citizen.objects.get(name="Jovi")
    presidentData = citizenData.president

    template = loader.get_template('displayPresident.html')
    context = {
        'presidentData': presidentData,
    }

    return HttpResponse(template.render(context, request))


def displayPizza(request):
    ###################################################
    # add pizza and topping
    # hawaiian_pizza = Pizza.objects.create(name="Hawaiian pizza")
    # hawaiian_pizza.save()

    # pineapple_toppings = Topping.objects.create(name="Pineapple toppings")
    # pineapple_toppings.save()

    # hawaiian_pizza.toppings.add(pineapple_toppings)
    ####################################################

    ####################################################
    # get all pizza
    # pizza = Pizza.objects.all().values()

    # get hawaiian_pizza toppings
    hawaiian_pizza = Pizza.objects.get(name="Hawaiian pizza")
    # OR
    # hawaiian_pizza = Pizza.objects.filter(name='Hawaiian pizza')[0]
    ####################################################

    # pizza show toppings
    pizza = hawaiian_pizza.toppings.all()

    # toppings show pizza
    # pizza = pineapple_toppings.pizza_set.all()
    template = loader.get_template('displayPizza.html')
    context = {
        'pizza': pizza
    }
    return HttpResponse(template.render(context, request))


def accessDatabase(request):
    template = loader.get_template('readDatabase.html')
    query = L3app.objects.all().values()
    context = {
        'query': query
    }
    return HttpResponse(template.render(context, request))


def writeMultipleData(request):
    template = loader.get_template('writeMultipleData.html')

    L3appRecord1 = L3app(name="Tom", hobby='hiking')
    L3appRecord2 = L3app(name="Jane", hobby='dancing')
    L3appRecord3 = L3app(name="Emil", hobby='swimming')
    L3appRecord_list = [L3appRecord1, L3appRecord2, L3appRecord3]

    for record in L3appRecord_list:
        record.save()

    queryWriteMultipleData = L3app.objects.all().values()
    context = {
        'queryWriteMultipleData': queryWriteMultipleData,
    }
    return HttpResponse(template.render(context, request))


def displayName(request):
    namesFromDatabase = L3app.objects.all().values()
    tempOutput = ""
    for people in namesFromDatabase:
        tempOutput += people['name']

    return HttpResponse(tempOutput)


def displayDatabase(request):
    allData = L3app.objects.all().values()
    template = loader.get_template('displayFullData.html')
    context = {
        'allData': allData
    }
    return HttpResponse(template.render(context, request))


def mycss(request):
    template = loader.get_template('mycss.html')
    return HttpResponse(template.render({'name': 'Tom'}, request))
