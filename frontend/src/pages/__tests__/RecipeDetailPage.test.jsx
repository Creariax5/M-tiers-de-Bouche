import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeDetailPage from '../RecipeDetailPage';
import { useAuthStore } from '../../stores/authStore';
import api from '../../lib/api';

vi.mock('../../lib/api');
vi.mock('../../stores/authStore');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'recipe-123' }),
  };
});

describe('RecipeDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: { email: 'test@example.com' },
      logout: vi.fn(),
    });
  });

  it('should display loading state initially', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <RecipeDetailPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/chargement\.\.\./i)).toBeInTheDocument();
  });

  it('should display recipe details after loading', async () => {
    api.get.mockResolvedValue({
      data: {
        id: 'recipe-123',
        name: 'Croissant au beurre',
        category: 'Viennoiserie',
        description: 'Un délicieux croissant maison',
        servings: 12,
        preparationTime: 30,
        cookingTime: 20,
        restingTime: 120,
        ingredients: [
          {
            quantity: 500,
            unit: 'G',
            lossPercent: 5,
            baseIngredient: { name: 'Farine T45' },
          },
          {
            quantity: 250,
            unit: 'G',
            lossPercent: 0,
            customIngredient: { name: 'Beurre de Normandie' },
          },
        ],
        allergens: ['gluten', 'lait'],
        nutrition: {
          per100g: {
            energyKcal: 406,
            energyKj: 1700,
            proteins: 8.2,
            carbs: 45.8,
            sugars: 12.5,
            fats: 21.0,
            saturatedFats: 14.2,
            fiber: 1.8,
            salt: 0.8,
          },
          totalWeight: 750,
        },
      },
    });

    render(
      <BrowserRouter>
        <RecipeDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Croissant au beurre')).toBeInTheDocument();
    });

    // Vérifier catégorie
    expect(screen.getByText('Viennoiserie')).toBeInTheDocument();

    // Vérifier description
    expect(screen.getByText(/un délicieux croissant maison/i)).toBeInTheDocument();

    // Vérifier statistiques
    expect(screen.getByText('12')).toBeInTheDocument(); // portions
    expect(screen.getByText('30 min')).toBeInTheDocument(); // préparation
    expect(screen.getByText('20 min')).toBeInTheDocument(); // cuisson
    expect(screen.getByText('120 min')).toBeInTheDocument(); // repos

    // Vérifier ingrédients
    expect(screen.getByText(/farine t45/i)).toBeInTheDocument();
    expect(screen.getByText(/500 g/i)).toBeInTheDocument();
    expect(screen.getByText(/beurre de normandie/i)).toBeInTheDocument();
    expect(screen.getByText(/250 g/i)).toBeInTheDocument();

    // Vérifier badges type
    expect(screen.getByText('base')).toBeInTheDocument();
    expect(screen.getByText('custom')).toBeInTheDocument();

    // Vérifier allergènes
    expect(screen.getByText('gluten')).toBeInTheDocument();
    expect(screen.getByText('lait')).toBeInTheDocument();

    // Vérifier nutrition (nouvelle structure per100g)
    expect(screen.getByText(/406/)).toBeInTheDocument(); // kcal
    expect(screen.getByText(/8\.2/)).toBeInTheDocument(); // protéines
    expect(screen.getByText(/45\.8/)).toBeInTheDocument(); // glucides
    expect(screen.getByText(/21/)).toBeInTheDocument(); // lipides
  });

  it('should display perte percentage if > 0', async () => {
    api.get.mockResolvedValue({
      data: {
        id: 'recipe-123',
        name: 'Test',
        servings: 1,
        ingredients: [
          {
            quantity: 500,
            unit: 'G',
            lossPercent: 10,
            baseIngredient: { name: 'Farine' },
          },
        ],
      },
    });

    render(
      <BrowserRouter>
        <RecipeDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/perte 10%/i)).toBeInTheDocument();
    });
  });

  it('should handle sub-recipe ingredient', async () => {
    api.get.mockResolvedValue({
      data: {
        id: 'recipe-123',
        name: 'Test',
        servings: 1,
        ingredients: [
          {
            quantity: 2,
            unit: 'PIECE',
            lossPercent: 0,
            subRecipe: { name: 'Pâte feuilletée' },
          },
        ],
      },
    });

    render(
      <BrowserRouter>
        <RecipeDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/pâte feuilletée/i)).toBeInTheDocument();
      expect(screen.getByText('recette')).toBeInTheDocument();
    });
  });

  it('should navigate to edit page when clicking Modifier button', async () => {
    api.get.mockResolvedValue({
      data: {
        id: 'recipe-123',
        name: 'Croissant',
        servings: 12,
        ingredients: [],
      },
    });

    render(
      <BrowserRouter>
        <RecipeDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Croissant')).toBeInTheDocument();
    });

    // Cliquer sur un des boutons "Modifier"
    const modifyButtons = screen.getAllByRole('button', { name: /modifier/i });
    modifyButtons[0].click();

    expect(mockNavigate).toHaveBeenCalledWith('/recipes/recipe-123/edit');
  });

  it('should navigate to recipes list when clicking Retour button', async () => {
    api.get.mockResolvedValue({
      data: {
        id: 'recipe-123',
        name: 'Croissant',
        servings: 12,
        ingredients: [],
      },
    });

    render(
      <BrowserRouter>
        <RecipeDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Croissant')).toBeInTheDocument();
    });

    const backButtons = screen.getAllByRole('button', { name: /retour/i });
    backButtons[0].click();

    expect(mockNavigate).toHaveBeenCalledWith('/recipes');
  });

  it('should display error message if recipe not found', async () => {
    api.get.mockRejectedValue(new Error('Not found'));

    render(
      <BrowserRouter>
        <RecipeDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/erreur lors du chargement de la recette/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /retour aux recettes/i })).toBeInTheDocument();
  });

  it('should not display nutrition section if data is missing', async () => {
    api.get.mockResolvedValue({
      data: {
        id: 'recipe-123',
        name: 'Test',
        servings: 1,
        ingredients: [],
        // Pas de nutrition
      },
    });

    render(
      <BrowserRouter>
        <RecipeDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    expect(screen.queryByText(/informations nutritionnelles/i)).not.toBeInTheDocument();
  });

  it('should not display allergens section if empty', async () => {
    api.get.mockResolvedValue({
      data: {
        id: 'recipe-123',
        name: 'Test',
        servings: 1,
        ingredients: [],
        allergens: [],
      },
    });

    render(
      <BrowserRouter>
        <RecipeDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    expect(screen.queryByText(/allergènes/i)).not.toBeInTheDocument();
  });

  it('should display ingredients count', async () => {
    api.get.mockResolvedValue({
      data: {
        id: 'recipe-123',
        name: 'Test',
        servings: 1,
        ingredients: [
          { quantity: 500, unit: 'G', baseIngredient: { name: 'Farine' } },
          { quantity: 250, unit: 'G', baseIngredient: { name: 'Beurre' } },
          { quantity: 50, unit: 'G', baseIngredient: { name: 'Sucre' } },
        ],
      },
    });

    render(
      <BrowserRouter>
        <RecipeDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ingrédients \(3\)/i)).toBeInTheDocument();
    });
  });
});
