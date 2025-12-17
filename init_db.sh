#!/bin/bash
echo "Starting Docker/Postgres..."
docker compose down
docker compose up -d

echo "Waiting for DB (10s)..."
sleep 10

echo "Running Migrations..."
npm run prisma:migrate

echo "Seeding Data..."
npm run prisma:seed

echo "Done! You can now run 'npm run dev'"
