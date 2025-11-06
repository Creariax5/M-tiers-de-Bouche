-- AlterTable
ALTER TABLE "recipe_ingredients" ADD COLUMN     "subRecipeId" TEXT,
ALTER COLUMN "ingredientId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "recipe_ingredients_subRecipeId_idx" ON "recipe_ingredients"("subRecipeId");

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_subRecipeId_fkey" FOREIGN KEY ("subRecipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
