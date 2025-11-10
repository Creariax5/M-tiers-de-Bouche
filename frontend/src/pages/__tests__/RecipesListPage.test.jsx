import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RecipesListPage from '../RecipesListPage';
import api from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

// Mock du module API
vi.mock('../../lib/api', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock du router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('RecipesListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    
    // Mock d'un utilisateur connecté
    useAuthStore.setState({
      user: { id: 1, email: 'test@example.com', firstName: 'John' },
      token: 'fake-token',
    });
  });

  test('affiche le titre et le bouton nouvelle recette', async () => {
    api.get.mockResolvedValue({
      data: {
        recipes: [],
        total: 0,
        page: 1,
        totalPages: 0,
      },
    });

    render(
      <BrowserRouter>
        <RecipesListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /mes recettes/i })).toBeInTheDocument();
      // Il y a 2 boutons "Nouvelle recette" : un dans la nav, un dans la page
      const buttons = screen.getAllByRole('button', { name: /nouvelle recette/i });
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  test('affiche la liste des recettes', async () => {
    api.get.mockResolvedValue({
      data: {
        recipes: [
          {
            id: '1',
            name: 'Croissant',
            category: 'Viennoiserie',
            servings: 10,
            createdAt: '2025-11-01T10:00:00Z',
          },
          {
            id: '2',
            name: 'Pain au chocolat',
            category: 'Viennoiserie',
            servings: 8,
            createdAt: '2025-11-02T10:00:00Z',
          },
        ],
        total: 2,
        page: 1,
        totalPages: 1,
      },
    });

    render(
      <BrowserRouter>
        <RecipesListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Croissant')).toBeInTheDocument();
      expect(screen.getByText('Pain au chocolat')).toBeInTheDocument();
      // Viennoiserie apparaît 3 fois: 2 dans le tableau + 1 dans le select
      expect(screen.getAllByText('Viennoiserie').length).toBeGreaterThanOrEqual(2);
    });
  });

  test('affiche un message si aucune recette', async () => {
    api.get.mockResolvedValue({
      data: {
        recipes: [],
        total: 0,
        page: 1,
        totalPages: 0,
      },
    });

    render(
      <BrowserRouter>
        <RecipesListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/aucune recette/i)).toBeInTheDocument();
    });
  });

  test('filtre par recherche texte', async () => {
    const user = userEvent.setup();
    
    api.get.mockResolvedValue({
      data: {
        recipes: [
          { id: '1', name: 'Croissant', category: 'Viennoiserie', servings: 10 },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
      },
    });

    render(
      <BrowserRouter>
        <RecipesListPage />
      </BrowserRouter>
    );

    const searchInput = await screen.findByPlaceholderText(/rechercher/i);
    await user.type(searchInput, 'croissant');

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('search=croissant'),
      );
    });
  });

  test('filtre par catégorie', async () => {
    const user = userEvent.setup();
    
    api.get.mockResolvedValue({
      data: {
        recipes: [],
        total: 0,
        page: 1,
        totalPages: 0,
      },
    });

    render(
      <BrowserRouter>
        <RecipesListPage />
      </BrowserRouter>
    );

    const categorySelect = await screen.findByRole('combobox');
    await user.selectOptions(categorySelect, 'Viennoiserie');

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('category=Viennoiserie'),
      );
    });
  });

  test('navigue vers la création de recette', async () => {
    const user = userEvent.setup();
    
    api.get.mockResolvedValue({
      data: {
        recipes: [],
        total: 0,
        page: 1,
        totalPages: 0,
      },
    });

    render(
      <BrowserRouter>
        <RecipesListPage />
      </BrowserRouter>
    );

    // Récupérer tous les boutons "Nouvelle recette" et cliquer sur le dernier (celui de la page, pas la nav)
    const newButtons = await screen.findAllByRole('button', { name: /nouvelle recette/i });
    await user.click(newButtons[newButtons.length - 1]);

    expect(mockNavigate).toHaveBeenCalledWith('/recipes/new');
  });

  test('navigue vers édition de recette', async () => {
    const user = userEvent.setup();
    
    api.get.mockResolvedValue({
      data: {
        recipes: [
          { id: '1', name: 'Croissant', category: 'Viennoiserie', servings: 10 },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
      },
    });

    render(
      <BrowserRouter>
        <RecipesListPage />
      </BrowserRouter>
    );

    // Attendre que le tableau soit chargé
    await screen.findByText('Croissant');
    
    // Il y a plusieurs boutons "Modifier" (nav + tableau), on prend celui dans le tableau
    const modifyButtons = screen.getAllByRole('button', { name: /modifier/i });
    const tableModifyButton = modifyButtons.find(btn => 
      btn.className.includes('text-indigo-600')
    );
    
    await user.click(tableModifyButton);

    expect(mockNavigate).toHaveBeenCalledWith('/recipes/1/edit');
  });

  test('supprime une recette avec confirmation', async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn(() => true);
    
    api.get.mockResolvedValue({
      data: {
        recipes: [
          { id: '1', name: 'Croissant', category: 'Viennoiserie', servings: 10 },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
      },
    });
    
    api.delete.mockResolvedValue({ data: { message: 'Recette supprimée' } });

    render(
      <BrowserRouter>
        <RecipesListPage />
      </BrowserRouter>
    );

    const deleteButton = await screen.findByRole('button', { name: /supprimer/i });
    await user.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/recipes/1');
    });
  });

  test('gère la pagination', async () => {
    const user = userEvent.setup();
    
    let callCount = 0;
    api.get.mockImplementation(() => {
      callCount++;
      const currentPage = callCount; // 1ère fois = page 1, 2ème fois = page 2
      return Promise.resolve({
        data: {
          recipes: Array(20).fill(null).map((_, i) => ({
            id: `${i + 1 + (currentPage - 1) * 20}`,
            name: `Recette ${i + 1 + (currentPage - 1) * 20}`,
            category: 'Test',
            servings: 10,
          })),
          total: 100,
          page: currentPage,
          totalPages: 5,
        },
      });
    });

    render(
      <BrowserRouter>
        <RecipesListPage />
      </BrowserRouter>
    );

    // Attendre affichage page 1
    await waitFor(() => {
      expect(screen.getByText('1', { selector: 'span' })).toBeInTheDocument();
      expect(screen.getByText('5', { selector: 'span' })).toBeInTheDocument();
    });
    
    const nextButton = screen.getAllByRole('button', { name: /suivant/i })[0];
    await user.click(nextButton);

    // Attendre que le composant appelle api.get une 2ème fois
    await waitFor(() => {
      expect(callCount).toBe(2);
    }, { timeout: 3000 });
  });

  test('affiche état de chargement', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Pending forever

    render(
      <BrowserRouter>
        <RecipesListPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  test('affiche erreur si échec API', async () => {
    api.get.mockRejectedValue(new Error('Network error'));

    render(
      <BrowserRouter>
        <RecipesListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    });
  });
});
