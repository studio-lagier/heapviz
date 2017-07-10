#!/bin/bash
PARENT="$(pwd)"
PROJECT=${PARENT##*/}

docker rm -f $PROJECT
docker build -t tomlagier/$PROJECT -f ./scripts/Dockerfile ./
HOST_PORT=$(jq -r .hostPort package.json)
docker run -d -p $HOST_PORT:80 --name $PROJECT tomlagier/$PROJECT