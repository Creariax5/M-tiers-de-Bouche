#!/bin/sh
set -e

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed"

echo "🚀 Starting Recipe Service..."
exec node src/index.js
