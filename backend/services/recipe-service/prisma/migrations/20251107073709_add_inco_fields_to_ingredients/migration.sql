/*
  Warnings:

  - You are about to drop the column `fat` on the `base_ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `protein` on the `base_ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `sugar` on the `base_ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `fat` on the `custom_ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `protein` on the `custom_ingredients` table. All the data in the column will be lost.
  - Added the required column `fats` to the `base_ingredients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proteins` to the `base_ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "base_ingredients" DROP COLUMN "fat",
DROP COLUMN "protein",
DROP COLUMN "sugar",
ADD COLUMN     "fats" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "proteins" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "saturatedFats" DOUBLE PRECISION,
ADD COLUMN     "sugars" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "custom_ingredients" DROP COLUMN "fat",
DROP COLUMN "protein",
ADD COLUMN     "fats" DOUBLE PRECISION,
ADD COLUMN     "proteins" DOUBLE PRECISION,
ADD COLUMN     "saturatedFats" DOUBLE PRECISION,
ADD COLUMN     "sugars" DOUBLE PRECISION;
