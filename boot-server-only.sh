# source boot-server-only.sh
# source boot-server-only.sh down
# source boot-server-only.sh up build
docker-compose -f docker-compose.local-db.yml -f docker-compose.local.yml ${1:-up} $2