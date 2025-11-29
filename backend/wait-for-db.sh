#!/bin/sh
set -e

host="$DB_HOST"
port="${DB_PORT:-3306}"

echo "Waiting for database at $host:$port..."

until nc -z "$host" "$port"; do
  echo "Database not ready yet, sleeping 2 seconds..."
  sleep 2
done

echo "Database is ready! Starting backend..."
exec "$@"