#/bin/sh

git fetch
git reset --hard origin/master
docker-compose build && docker-compose up -d
