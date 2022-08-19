#!/bin/bash
echo "Using test environment variables"
export $(cat ./env/.env.test | xargs)

./node_modules/.bin/jest --watch