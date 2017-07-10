#!/bin/bash
docker rm -f heapviz
docker pull tomlagier/heapviz:latest
HOST_PORT=$(jq -r .hostPort package.json)
docker run -d -p $HOST_PORT:80 --name heapviz tomlagier/heapviz