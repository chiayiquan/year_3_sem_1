#!/bin/bash

# Name of the virtual environment
ENV_NAME=social_network_env

# Create a new virtual environment
python3 -m venv $ENV_NAME

# Activate the virtual environment
source $ENV_NAME/bin/activate

# Install the requirements
pip install -r ./requirements.txt

# Change directory to project folder
cd ./socialNetwork
