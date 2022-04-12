#!/bin/bash

# this is to create a new app inside a django project

if [ -z "$1" ]
then
      echo "App name not provided"
else
      python manage.py startapp $1
fi
