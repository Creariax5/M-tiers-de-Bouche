import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import api from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

// Mock du module API
vi.mock('../../lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock du router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock d'un utilisateur connecté
    useAuthStore.setState({
      user: { id: 1, email: 'test@example.com', firstName: 'John' },
      token: 'fake-token',
    });
  });

  test('affiche le titre et message de bienvenue', async () => {
    api.get.mockResolvedValue({
      data: {
        totalRecipes: 0,
        topProfitable: [],
        createdByMonth: [],
      },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /tableau de bord/i })).toBeInTheDocument();
      expect(screen.getByText(/bienvenue/i)).toBeInTheDocument();
    });
  });

  test('affiche le nombre total de recettes', async () => {
    api.get.mockResolvedValue({
      data: {
        totalRecipes: 42,
        topProfitable: [],
        createdByMonth: [],
      },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument();
      // Utiliser getAllByText car "Recettes créées" apparaît 2 fois (stat + titre graphique)
      const elements = screen.getAllByText(/recettes créées/i);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  test('affiche les 5 recettes les plus rentables', async () => {
    api.get.mockResolvedValue({
      data: {
        totalRecipes: 10,
        topProfitable: [
          { id: 1, name: 'Croissant', margin: 65.5 },
          { id: 2, name: 'Pain au chocolat', margin: 58.2 },
          { id: 3, name: 'Tarte citron', margin: 52.0 },
          { id: 4, name: 'Éclair', margin: 48.5 },
          { id: 5, name: 'Macaron', margin: 45.0 },
        ],
        createdByMonth: [],
      },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/recettes les plus rentables/i)).toBeInTheDocument();
      expect(screen.getByText('Croissant')).toBeInTheDocument();
      expect(screen.getByText('65.5%')).toBeInTheDocument();
      expect(screen.getByText('Pain au chocolat')).toBeInTheDocument();
      expect(screen.getByText('Macaron')).toBeInTheDocument();
    });
  });

  test('affiche un message si aucune recette', async () => {
    api.get.mockResolvedValue({
      data: {
        totalRecipes: 0,
        topProfitable: [],
        createdByMonth: [],
      },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/aucune recette/i)).toBeInTheDocument();
    });
  });

  test('affiche le graphique des recettes par mois', async () => {
    api.get.mockResolvedValue({
      data: {
        totalRecipes: 15,
        topProfitable: [],
        createdByMonth: [
          { month: '2024-10', count: 5 },
          { month: '2024-11', count: 7 },
          { month: '2024-12', count: 3 },
        ],
      },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/recettes créées par mois/i)).toBeInTheDocument();
      // Vérifier que les données du graphique sont présentes
      expect(screen.getByText(/octobre/i)).toBeInTheDocument();
      expect(screen.getByText(/novembre/i)).toBeInTheDocument();
    });
  });

  test('affiche état de chargement', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Pending forever

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  test('affiche erreur si échec API', async () => {
    api.get.mockRejectedValue(new Error('Network error'));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    });
  });

  test('appelle GET /recipes/stats au chargement', async () => {
    api.get.mockResolvedValue({
      data: {
        totalRecipes: 0,
        topProfitable: [],
        createdByMonth: [],
      },
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/recipes/stats');
    });
  });
});
