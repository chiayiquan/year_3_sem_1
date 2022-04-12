#!/bin/bash

if [ -z "$1" ]
then
      echo "App name not provided"
else
      python manage.py startapp $1
fi
