#!/bin/bash

# this script is to create a new django project

if [ -z "$1" ]
then
      echo "App name not provided"
else
      django-admin startproject $1
fi
