import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../../features/dashboard/DashboardPage';
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

describe('DashboardPage', () => {
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
      },
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/bienvenue john/i)).toBeInTheDocument();
    });
  });

  test('affiche le nombre total de recettes', async () => {
    api.get.mockResolvedValue({
      data: {
        totalRecipes: 42,
        topProfitable: [],
      },
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText(/recettes créées/i)).toBeInTheDocument();
    });
  });

  test('affiche les 5 recettes les plus rentables', async () => {
    api.get.mockResolvedValue({
      data: {
        totalRecipes: 10,
        topProfitable: [
          { id: 1, name: 'Croissant', totalCost: 1.20, suggestedPrice: 3.50, margin: 65.5 },
          { id: 2, name: 'Pain au chocolat', totalCost: 1.50, suggestedPrice: 3.60, margin: 58.2 },
          { id: 3, name: 'Tarte citron', totalCost: 4.80, suggestedPrice: 10.00, margin: 52.0 },
          { id: 4, name: 'Éclair', totalCost: 1.80, suggestedPrice: 3.50, margin: 48.5 },
          { id: 5, name: 'Macaron', totalCost: 0.55, suggestedPrice: 1.00, margin: 45.0 },
        ],
      },
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/recettes les plus rentables/i)).toBeInTheDocument();
      expect(screen.getByText('Croissant')).toBeInTheDocument();
      expect(screen.getByText('65.5 %')).toBeInTheDocument();
      expect(screen.getByText('Pain au chocolat')).toBeInTheDocument();
      expect(screen.getByText('Macaron')).toBeInTheDocument();
    });
  });

  test('affiche un message et CTA si aucune recette', async () => {
    api.get.mockResolvedValue({
      data: {
        totalRecipes: 0,
        topProfitable: [],
      },
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/vous n'avez pas encore de recettes/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /créer ma première recette/i })).toBeInTheDocument();
    });
  });

  test('affiche état de chargement', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Pending forever

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/chargement des statistiques/i)).toBeInTheDocument();
  });

  test('affiche erreur si échec API', async () => {
    api.get.mockRejectedValue(new Error('Network error'));

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/erreur de chargement/i)).toBeInTheDocument();
    });
  });

  test('appelle GET /recipes/stats au chargement', async () => {
    api.get.mockResolvedValue({
      data: {
        totalRecipes: 0,
        topProfitable: [],
      },
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/recipes/stats');
    });
  });
});
