import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CustomIngredientsPage from '../CustomIngredientsPage';
import api from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

// Mock du module API
vi.mock('../../lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
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

describe('CustomIngredientsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();

    // Mock d'un utilisateur connecté
    useAuthStore.setState({
      user: { id: 1, email: 'test@example.com', firstName: 'John' },
      token: 'fake-token',
    });
  });

  describe('Rendering', () => {
    test('should display page title and create button', async () => {
      api.get.mockResolvedValue({ data: [] });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /ingrédients personnalisés/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /nouvel ingrédient/i })).toBeInTheDocument();
      });
    });

    test('should display list of custom ingredients', async () => {
      api.get.mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'Farine bio',
            category: 'FARINES',
            price: 3.50,
            priceUnit: 'KG',
            supplier: 'Bio Market',
            expiryDate: new Date('2025-12-31').toISOString(),
          },
          {
            id: '2',
            name: 'Chocolat 70%',
            category: 'CHOCOLAT_CACAO',
            price: 12.00,
            priceUnit: 'KG',
            supplier: null,
            expiryDate: null,
          },
        ],
      });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Farine bio')).toBeInTheDocument();
        expect(screen.getByText('Chocolat 70%')).toBeInTheDocument();
        expect(screen.getByText('Bio Market')).toBeInTheDocument();
        expect(screen.getByText(/3[.,]50/)).toBeInTheDocument();
      });
    });

    test('should display empty state message', async () => {
      api.get.mockResolvedValue({ data: [] });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/aucun ingrédient personnalisé/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /créer mon premier/i })).toBeInTheDocument();
      });
    });
  });

  describe('Loading states', () => {
    test('should show loading state', async () => {
      api.get.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      expect(screen.getByText(/chargement/i)).toBeInTheDocument();
    });

    test('should show error message on API failure', async () => {
      api.get.mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/erreur/i)).toBeInTheDocument();
      });
    });
  });

  describe('DLC badges', () => {
    test('should display warning badge for ingredient expiring soon', async () => {
      const soonDate = new Date();
      soonDate.setDate(soonDate.getDate() + 5); // 5 jours

      api.get.mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'Beurre AOP',
            category: 'MATIERES_GRASSES',
            price: 8.50,
            priceUnit: 'KG',
            supplier: 'Laiterie',
            expiryDate: soonDate.toISOString(),
          },
        ],
      });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Beurre AOP')).toBeInTheDocument();
        // Badge warning orange/yellow
        expect(screen.getByText(/proche/i)).toBeInTheDocument();
      });
    });

    test('should display danger badge for expired ingredient', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 2); // 2 jours passés

      api.get.mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'Crème fraîche',
            category: 'PRODUITS_LAITIERS',
            price: 2.50,
            priceUnit: 'L',
            supplier: 'Laiterie',
            expiryDate: pastDate.toISOString(),
          },
        ],
      });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Crème fraîche')).toBeInTheDocument();
        // Badge danger rouge
        expect(screen.getByText(/dépassée/i)).toBeInTheDocument();
      });
    });

    test('should not display badge if no expiry date', async () => {
      api.get.mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'Farine',
            category: 'FARINES',
            price: 1.50,
            priceUnit: 'KG',
            supplier: null,
            expiryDate: null,
          },
        ],
      });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Farine')).toBeInTheDocument();
        expect(screen.queryByText(/proche/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/dépassée/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('CRUD operations', () => {
    test('should open create modal when clicking create button', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: [] });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      const createButton = await screen.findByRole('button', { name: /nouvel ingrédient/i });
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/créer un ingrédient/i)).toBeInTheDocument();
      });
    });

    test('should create ingredient successfully', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: [] });
      api.post.mockResolvedValue({
        data: {
          id: '1',
          name: 'Farine T65',
          category: 'FARINES',
          price: 2.00,
          priceUnit: 'KG',
        },
      });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      const createButton = await screen.findByRole('button', { name: /nouvel ingrédient/i });
      await user.click(createButton);

      // Remplir formulaire
      await user.type(screen.getByLabelText(/nom/i), 'Farine T65');
      await user.selectOptions(screen.getByLabelText(/catégorie/i), 'FARINES');
      await user.type(screen.getByLabelText(/prix/i), '2.00');

      // Soumettre
      const submitButton = screen.getByRole('button', { name: /créer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/ingredients/custom', expect.objectContaining({
          name: 'Farine T65',
          category: 'FARINES',
          price: 2.00,
        }));
        expect(api.get).toHaveBeenCalledTimes(2); // Initial + refresh
      });
    });

    test('should open edit modal when clicking edit button', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'Farine bio',
            category: 'FARINES',
            price: 3.50,
            priceUnit: 'KG',
          },
        ],
      });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      const editButton = await screen.findByRole('button', { name: /modifier/i });
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/modifier l'ingrédient/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Farine bio')).toBeInTheDocument();
      });
    });

    test('should update ingredient successfully', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'Farine bio',
            category: 'FARINES',
            price: 3.50,
            priceUnit: 'KG',
          },
        ],
      });
      api.put.mockResolvedValue({
        data: {
          id: '1',
          name: 'Farine bio T80',
          category: 'FARINES',
          price: 4.00,
          priceUnit: 'KG',
        },
      });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      const editButton = await screen.findByRole('button', { name: /modifier/i });
      await user.click(editButton);

      // Modifier nom
      const nameInput = screen.getByDisplayValue('Farine bio');
      await user.clear(nameInput);
      await user.type(nameInput, 'Farine bio T80');

      // Modifier prix
      const priceInput = screen.getByDisplayValue('3.5');
      await user.clear(priceInput);
      await user.type(priceInput, '4.00');

      // Soumettre
      const submitButton = screen.getByRole('button', { name: /enregistrer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith('/ingredients/custom/1', expect.objectContaining({
          name: 'Farine bio T80',
          price: 4.00,
        }));
        expect(api.get).toHaveBeenCalledTimes(2); // Initial + refresh
      });
    });

    test('should delete ingredient with confirmation', async () => {
      const user = userEvent.setup();
      window.confirm = vi.fn(() => true);

      api.get.mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'Farine bio',
            category: 'FARINES',
            price: 3.50,
            priceUnit: 'KG',
          },
        ],
      });
      api.delete.mockResolvedValue({ data: { message: 'Ingrédient supprimé' } });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      const deleteButton = await screen.findByRole('button', { name: /supprimer/i });
      await user.click(deleteButton);

      expect(window.confirm).toHaveBeenCalled();

      await waitFor(() => {
        expect(api.delete).toHaveBeenCalledWith('/ingredients/custom/1');
        expect(api.get).toHaveBeenCalledTimes(2); // Initial + refresh
      });
    });

    test('should not delete if user cancels confirmation', async () => {
      const user = userEvent.setup();
      window.confirm = vi.fn(() => false);

      api.get.mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'Farine bio',
            category: 'FARINES',
            price: 3.50,
            priceUnit: 'KG',
          },
        ],
      });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      const deleteButton = await screen.findByRole('button', { name: /supprimer/i });
      await user.click(deleteButton);

      expect(window.confirm).toHaveBeenCalled();
      expect(api.delete).not.toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    test('should show validation error if name is empty', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: [] });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      const createButton = await screen.findByRole('button', { name: /nouvel ingrédient/i });
      await user.click(createButton);

      // Soumettre sans remplir
      const submitButton = screen.getByRole('button', { name: /créer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/nom.*requis/i)).toBeInTheDocument();
      });

      expect(api.post).not.toHaveBeenCalled();
    });

    test('should show validation error if price is invalid', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: [] });

      render(
        <BrowserRouter>
          <CustomIngredientsPage />
        </BrowserRouter>
      );

      const createButton = await screen.findByRole('button', { name: /nouvel ingrédient/i });
      await user.click(createButton);

      // Remplir avec prix invalide
      await user.type(screen.getByLabelText(/nom/i), 'Farine');
      await user.type(screen.getByLabelText(/prix/i), '-5');

      const submitButton = screen.getByRole('button', { name: /créer/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/prix.*positif/i)).toBeInTheDocument();
      });

      expect(api.post).not.toHaveBeenCalled();
    });
  });
});
