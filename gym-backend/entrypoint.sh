#!/bin/sh
export SERVER_PORT=${PORT:-8080}
exec java -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod} -jar app.jar
