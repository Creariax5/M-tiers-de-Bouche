#!/bin/bash
set -e

# ========================================
# PostgreSQL Multi-Database Initialization
# ========================================
# Crée 3 bases de données isolées :
# - saas_auth : Users, Subscriptions, Payments
# - saas_recipes : Recipes, Ingredients, Nutritional data
# - saas_production : Production planning
# ========================================

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Base de données pour auth-service
    CREATE DATABASE saas_auth;
    GRANT ALL PRIVILEGES ON DATABASE saas_auth TO $POSTGRES_USER;

    -- Base de données pour recipe-service
    CREATE DATABASE saas_recipes;
    GRANT ALL PRIVILEGES ON DATABASE saas_recipes TO $POSTGRES_USER;

    -- Base de données pour production-service
    CREATE DATABASE saas_production;
    GRANT ALL PRIVILEGES ON DATABASE saas_production TO $POSTGRES_USER;

    -- Log de confirmation
    SELECT 'Databases created successfully!' AS status;
EOSQL

echo "✅ PostgreSQL: 3 bases créées (saas_auth, saas_recipes, saas_production)"
