import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeFormPage from '../RecipeFormPage';
import api from '../../lib/api';

// Mock API
vi.mock('../../lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock authStore
vi.mock('../../stores/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'user-123', email: 'test@example.com' },
    logout: vi.fn(),
  }),
}));

describe('RecipeFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // ========================================
  // Tests Étape 1 : Informations générales
  // ========================================
  describe('Step 1 - Informations générales', () => {
    it('should render step 1 with all required fields', () => {
      render(
        <BrowserRouter>
          <RecipeFormPage />
        </BrowserRouter>
      );

      // Titre
      expect(screen.getByText(/nouvelle recette/i)).toBeInTheDocument();

      // Stepper (utiliser getAllByText car "Informations" apparaît 2 fois)
      expect(screen.getAllByText(/informations/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/ingrédients/i)).toBeInTheDocument();
      expect(screen.getByText(/révision/i)).toBeInTheDocument();

      // Champs Step 1
      expect(screen.getByLabelText(/nom de la recette/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/catégorie/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nombre de portions/i)).toBeInTheDocument();

      // Bouton Suivant
      expect(screen.getByRole('button', { name: /suivant/i })).toBeInTheDocument();
    });

    it('should validate required fields in step 1', async () => {
      render(
        <BrowserRouter>
          <RecipeFormPage />
        </BrowserRouter>
      );

      const nextButton = screen.getByRole('button', { name: /suivant/i });
      fireEvent.click(nextButton);

      // Vérifier messages d'erreur
      await waitFor(() => {
        expect(screen.getByText(/nom est requis/i)).toBeInTheDocument();
      });
    });

    it('should accept valid data and move to step 2', async () => {
      api.post = vi.fn().mockResolvedValue({
        data: { id: 'recipe-123', name: 'Croissant', category: 'Viennoiserie' },
      });

      render(
        <BrowserRouter>
          <RecipeFormPage />
        </BrowserRouter>
      );

      // Remplir formulaire
      fireEvent.change(screen.getByLabelText(/nom de la recette/i), {
        target: { value: 'Croissant' },
      });
      fireEvent.change(screen.getByLabelText(/catégorie/i), {
        target: { value: 'Viennoiserie' },
      });
      fireEvent.change(screen.getByLabelText(/nombre de portions/i), {
        target: { value: '12' },
      });

      // Cliquer Suivant
      const nextButton = screen.getByRole('button', { name: /suivant/i });
      fireEvent.click(nextButton);

      // Vérifier appel API
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/recipes', expect.objectContaining({
          name: 'Croissant',
          category: 'Viennoiserie',
          portions: 12,
        }));
      });

      // Vérifier passage étape 2
      await waitFor(() => {
        expect(screen.getByText(/ajouter des ingrédients/i)).toBeInTheDocument();
      });
    });

    it('should save draft to localStorage on input change', async () => {
      render(
        <BrowserRouter>
          <RecipeFormPage />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/nom de la recette/i), {
        target: { value: 'Pain au chocolat' },
      });

      // Attendre debounce
      await waitFor(() => {
        const draft = JSON.parse(localStorage.getItem('recipe_draft') || '{}');
        expect(draft.name).toBe('Pain au chocolat');
      }, { timeout: 1000 });
    });
  });

  // ========================================
  // Tests Étape 2 : Ingrédients
  // ========================================
  describe('Step 2 - Ingrédients', () => {
    beforeEach(async () => {
      api.post = vi.fn().mockResolvedValue({
        data: { id: 'recipe-123', name: 'Croissant' },
      });
      api.get = vi.fn().mockResolvedValue({
        data: [
          { id: 'ing-1', name: 'Farine T45', unit: 'g', pricePerKg: 1.5 },
          { id: 'ing-2', name: 'Beurre', unit: 'g', pricePerKg: 8.0 },
        ],
      });
    });

    it('should display ingredient search and list', async () => {
      render(
        <BrowserRouter>
          <RecipeFormPage />
        </BrowserRouter>
      );

      // Remplir step 1 et passer à step 2
      fireEvent.change(screen.getByLabelText(/nom de la recette/i), {
        target: { value: 'Croissant' },
      });
      fireEvent.click(screen.getByRole('button', { name: /suivant/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/rechercher un ingrédient/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/ajouter des ingrédients/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /précédent/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /suivant/i })).toBeInTheDocument();
    });

    it('should search and add ingredient', async () => {
      api.post = vi.fn()
        .mockResolvedValueOnce({ data: { id: 'recipe-123' } }) // POST /recipes
        .mockResolvedValueOnce({ data: { id: 'ri-1' } }); // POST /recipes/:id/ingredients

      render(
        <BrowserRouter>
          <RecipeFormPage />
        </BrowserRouter>
      );

      // Aller à step 2
      fireEvent.change(screen.getByLabelText(/nom de la recette/i), {
        target: { value: 'Croissant' },
      });
      fireEvent.click(screen.getByRole('button', { name: /suivant/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/rechercher un ingrédient/i)).toBeInTheDocument();
      });

      // Rechercher ingrédient
      const searchInput = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      fireEvent.change(searchInput, { target: { value: 'Farine' } });

      // Attendre autocomplete
      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/recipes/ingredients?search=Farine');
      });

      // Sélectionner ingrédient (simuler click sur suggestion)
      await waitFor(() => {
        const suggestion = screen.getByText(/farine t45/i);
        fireEvent.click(suggestion);
      });

      // Remplir quantité
      const quantityInput = screen.getByLabelText(/quantité/i);
      fireEvent.change(quantityInput, { target: { value: '500' } });

      // Ajouter
      const addButton = screen.getByRole('button', { name: /ajouter/i });
      fireEvent.click(addButton);

      // Vérifier appel API
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/recipes/recipe-123/ingredients', {
          ingredientId: 'ing-1',
          quantity: 500,
          unit: 'G', // Unité par défaut
          lossPercent: 0,
        });
      });
    });

    it('should go back to step 1', async () => {
      render(
        <BrowserRouter>
          <RecipeFormPage />
        </BrowserRouter>
      );

      // Aller à step 2
      fireEvent.change(screen.getByLabelText(/nom de la recette/i), {
        target: { value: 'Croissant' },
      });
      fireEvent.click(screen.getByRole('button', { name: /suivant/i }));

      await waitFor(() => {
        expect(screen.getByText(/ajouter des ingrédients/i)).toBeInTheDocument();
      });

      // Retour step 1
      fireEvent.click(screen.getByRole('button', { name: /précédent/i }));

      await waitFor(() => {
        expect(screen.getByText(/informations générales/i)).toBeInTheDocument();
      });
    });
  });

  // ========================================
  // Tests Étape 3 : Révision
  // ========================================
  describe('Step 3 - Révision', () => {
    beforeEach(() => {
      api.post = vi.fn().mockResolvedValue({ data: { id: 'recipe-123' } });
      
      // Mock api.get pour retourner les bonnes données selon l'URL
      api.get = vi.fn().mockImplementation((url) => {
        if (url.includes('/allergens')) {
          return Promise.resolve({ data: { allergens: ['gluten', 'lait'] } });
        }
        if (url.includes('/nutrition')) {
          return Promise.resolve({
            data: {
              nutrition: {
                per100g: {
                  energy: 350,
                  energyKj: 1464,
                  fat: 15.2,
                  saturatedFat: 9.1,
                  carbs: 42.5,
                  sugars: 5.3,
                  protein: 8.1,
                  salt: 0.45,
                },
              },
            },
          });
        }
        if (url.includes('/pricing')) {
          return Promise.resolve({
            data: {
              pricing: {
                totalCost: 2.45,
                costPer100g: 0.82,
                costPerServing: 0.20,
              },
            },
          });
        }
        // Par défaut (ingredients search)
        return Promise.resolve({ data: [] });
      });
    });

    it('should display recipe summary and calculations', async () => {
      render(
        <BrowserRouter>
          <RecipeFormPage />
        </BrowserRouter>
      );

      // Aller à step 3
      fireEvent.change(screen.getByLabelText(/nom de la recette/i), {
        target: { value: 'Croissant' },
      });
      fireEvent.click(screen.getByRole('button', { name: /suivant/i }));

      await waitFor(() => {
        expect(screen.getByText(/ajouter des ingrédients/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /suivant/i }));

      // Vérifier titre step 3
      await waitFor(() => {
        expect(screen.getByText(/révision/i)).toBeInTheDocument();
      });

      // Vérifier appels API
      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/recipes/recipe-123/allergens');
        expect(api.get).toHaveBeenCalledWith('/recipes/recipe-123/nutrition');
        expect(api.get).toHaveBeenCalledWith('/recipes/recipe-123/pricing');
      });

      // Vérifier affichage résultats
      await waitFor(() => {
        expect(screen.getByText(/gluten/i)).toBeInTheDocument();
        expect(screen.getByText(/lait/i)).toBeInTheDocument();
        expect(screen.getByText(/2.45/i)).toBeInTheDocument(); // Coût total
      });
    });

    it('should save recipe and redirect to recipes list', async () => {
      render(
        <BrowserRouter>
          <RecipeFormPage />
        </BrowserRouter>
      );

      // Aller à step 3
      fireEvent.change(screen.getByLabelText(/nom de la recette/i), {
        target: { value: 'Croissant' },
      });
      fireEvent.click(screen.getByRole('button', { name: /suivant/i }));
      await waitFor(() => {
        expect(screen.getByText(/ajouter des ingrédients/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: /suivant/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument();
      });

      // Enregistrer
      fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

      // Vérifier navigation
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/recipes');
      });

      // Vérifier localStorage nettoyé
      expect(localStorage.getItem('recipe_draft')).toBeNull();
    });

    it('should display loading state while fetching calculations', async () => {
      render(
        <BrowserRouter>
          <RecipeFormPage />
        </BrowserRouter>
      );

      // Aller à step 3
      fireEvent.change(screen.getByLabelText(/nom de la recette/i), {
        target: { value: 'Croissant' },
      });
      fireEvent.click(screen.getByRole('button', { name: /suivant/i }));
      await waitFor(() => {
        expect(screen.getByText(/ajouter des ingrédients/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: /suivant/i }));

      // Vérifier loading
      expect(screen.getByText(/chargement/i)).toBeInTheDocument();
    });
  });

  // ========================================
  // Tests Général
  // ========================================
  describe('General', () => {
    it('should display error message if API fails', async () => {
      api.post = vi.fn().mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <RecipeFormPage />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/nom de la recette/i), {
        target: { value: 'Croissant' },
      });
      fireEvent.click(screen.getByRole('button', { name: /suivant/i }));

      await waitFor(() => {
        expect(screen.getByText(/erreur/i)).toBeInTheDocument();
      });
    });

    it('should restore draft from localStorage on mount', () => {
      const draft = {
        name: 'Pain au chocolat',
        category: 'Viennoiserie',
        portions: 12,
      };
      localStorage.setItem('recipe_draft', JSON.stringify(draft));

      render(
        <BrowserRouter>
          <RecipeFormPage />
        </BrowserRouter>
      );

      expect(screen.getByDisplayValue('Pain au chocolat')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Viennoiserie')).toBeInTheDocument();
      expect(screen.getByDisplayValue('12')).toBeInTheDocument();
    });
  });
});
