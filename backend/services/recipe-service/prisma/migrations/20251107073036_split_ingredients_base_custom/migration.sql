/*
  Warnings:

  - You are about to drop the column `ingredientId` on the `recipe_ingredients` table. All the data in the column will be lost.
  - You are about to drop the `ingredients` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `unit` on the `recipe_ingredients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "IngredientCategory" AS ENUM ('FARINES', 'SUCRES', 'MATIERES_GRASSES', 'PRODUITS_LAITIERS', 'OEUFS', 'CHOCOLAT_CACAO', 'FRUITS', 'FRUITS_SECS', 'EPICES', 'LEVURES', 'ADDITIFS', 'AUTRE');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('G', 'KG', 'L', 'ML', 'PIECE');

-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_ingredientId_fkey";

-- DropIndex
DROP INDEX "recipe_ingredients_ingredientId_idx";

-- AlterTable
ALTER TABLE "recipe_ingredients" DROP COLUMN "ingredientId",
ADD COLUMN     "baseIngredientId" TEXT,
ADD COLUMN     "customIngredientId" TEXT,
DROP COLUMN "unit",
ADD COLUMN     "unit" "Unit" NOT NULL;

-- DropTable
DROP TABLE "ingredients";

-- CreateTable
CREATE TABLE "base_ingredients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "IngredientCategory" NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "salt" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION,
    "sugar" DOUBLE PRECISION,
    "allergens" TEXT[],
    "ciqualCode" TEXT,

    CONSTRAINT "base_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_ingredients" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "IngredientCategory" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceUnit" "Unit" NOT NULL,
    "supplier" TEXT,
    "lotNumber" TEXT,
    "expiryDate" TIMESTAMP(3),
    "calories" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "salt" DOUBLE PRECISION,
    "allergens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "base_ingredients_ciqualCode_key" ON "base_ingredients"("ciqualCode");

-- CreateIndex
CREATE INDEX "base_ingredients_name_idx" ON "base_ingredients"("name");

-- CreateIndex
CREATE INDEX "custom_ingredients_userId_idx" ON "custom_ingredients"("userId");

-- CreateIndex
CREATE INDEX "custom_ingredients_name_idx" ON "custom_ingredients"("name");

-- CreateIndex
CREATE INDEX "recipe_ingredients_baseIngredientId_idx" ON "recipe_ingredients"("baseIngredientId");

-- CreateIndex
CREATE INDEX "recipe_ingredients_customIngredientId_idx" ON "recipe_ingredients"("customIngredientId");

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_baseIngredientId_fkey" FOREIGN KEY ("baseIngredientId") REFERENCES "base_ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_customIngredientId_fkey" FOREIGN KEY ("customIngredientId") REFERENCES "custom_ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
