import express from 'express';
import recipeRoutes from './routes/recipe.routes.js';
import baseIngredientRoutes from './routes/baseIngredients.js';
import ingredientsRoutes from './routes/ingredients.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'recipe-service' });
});

app.use('/ingredients/base', baseIngredientRoutes);
app.use('/ingredients', ingredientsRoutes);
app.use('/', recipeRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Recipe Service running on port ${PORT}`);
  });
}

export default app;
