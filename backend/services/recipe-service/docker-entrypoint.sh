#!/bin/sh
set -e

echo "� Generating Prisma Client..."
npx prisma generate

echo "�🔄 Running Prisma migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed"

echo "🚀 Starting Recipe Service..."
exec node src/index.js
