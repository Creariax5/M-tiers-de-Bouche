import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const recipe = await prisma.recipe.findFirst({
    include: {
      ingredients: {
        include: {
          baseIngredient: true,
          customIngredient: true,
          subRecipe: true
        }
      }
    }
  });
  
  if (recipe) {
    console.log('Recipe:', recipe.name);
    console.log('Ingrédients:');
    recipe.ingredients.forEach((ing, i) => {
      console.log(`  [${i}] quantity: ${ing.quantity}, unit: ${ing.unit}`);
      console.log(`      baseIngredientId: ${ing.baseIngredientId}`);
      console.log(`      customIngredientId: ${ing.customIngredientId}`);
      console.log(`      baseIngredient: ${ing.baseIngredient ? ing.baseIngredient.name : 'null'}`);
      console.log(`      customIngredient: ${ing.customIngredient ? ing.customIngredient.name : 'null'}`);
    });
  } else {
    console.log('Aucune recette trouvée');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
