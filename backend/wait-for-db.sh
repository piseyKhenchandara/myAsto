#!/bin/sh
# wait-for-db.sh

set -e

host="$DB_HOST"
user="$DB_USER"
password="$DB_PASSWORD"

echo "Waiting for database at $host..."

until mysql -h "$host" -u "$user" -p"$password" -e "SELECT 1" &> /dev/null; do
  echo "Database not ready yet, sleeping 2 seconds..."
  sleep 2
done

echo "Database is ready! Starting backend..."
exec "$@"
