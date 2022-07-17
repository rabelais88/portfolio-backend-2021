#!/bin/bash

case ${1:-up} in
    "up") mutagen-compose -f docker-compose.local-db.yml -f docker-compose.local.yml up;;
    "down") mutagen-compose -f docker-compose.local-db.yml -f docker-compose.local.yml down;;
    "build") mutagen-compose -f docker-compose.local-db.yml -f docker-compose.local.yml up --build;;
esac