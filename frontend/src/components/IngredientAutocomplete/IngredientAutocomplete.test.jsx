/**
 * Tests pour IngredientAutocomplete
 * US-026: Autocomplete ingrédients avec debounce
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IngredientAutocomplete from './index';
import api from '../../lib/api';

// Mock API
vi.mock('../../lib/api');

describe('IngredientAutocomplete', () => {
  const mockIngredients = [
    {
      id: '1',
      name: 'Farine T65',
      category: 'FARINES',
      type: 'base',
    },
    {
      id: '2',
      name: 'Farine T55',
      category: 'FARINES',
      type: 'base',
    },
    {
      id: '3',
      name: 'Beurre AOP',
      category: 'MATIERES_GRASSES',
      type: 'custom',
    },
  ];

  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Recherche et debounce', () => {
    it('should not search with less than 2 characters', async () => {
      const user = userEvent.setup();
      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'F');

      // Attendre le debounce
      await new Promise((r) => setTimeout(r, 350));

      expect(api.get).not.toHaveBeenCalled();
    });

    it('should debounce search by 300ms', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: mockIngredients });

      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'Far');

      // Attendre le debounce (300ms + marge)
      await waitFor(
        () => {
          expect(api.get).toHaveBeenCalledWith('/ingredients?search=Far');
        },
        { timeout: 500 }
      );
    });

    it('should cancel previous search on new input', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: mockIngredients });

      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      
      await user.type(input, 'Far');
      await new Promise((r) => setTimeout(r, 100)); // Avant debounce
      
      await user.type(input, 'ine');

      await waitFor(
        () => {
          expect(api.get).toHaveBeenCalledTimes(1);
          expect(api.get).toHaveBeenCalledWith('/ingredients?search=Farine');
        },
        { timeout: 500 }
      );
    });

    it('should display loading state during search', async () => {
      const user = userEvent.setup();
      let resolveApi;
      api.get.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveApi = () => resolve({ data: mockIngredients });
          })
      );

      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'Far');

      // Attendre que le loading apparaisse
      await waitFor(
        () => {
          expect(screen.getByText(/recherche en cours/i)).toBeInTheDocument();
        },
        { timeout: 500 }
      );

      // Résoudre la promesse pour cleanup
      resolveApi();
    });
  });

  describe('Affichage des résultats', () => {
    it('should display search results with name and category', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: mockIngredients });

      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'Far');

      await waitFor(() => {
        expect(screen.getByText('Farine T65')).toBeInTheDocument();
        expect(screen.getByText('Farine T55')).toBeInTheDocument();
      });

      expect(screen.getAllByText(/farines/i).length).toBeGreaterThan(0);
    });

    it('should display type badge (base/custom)', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: mockIngredients });

      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'Beurre');

      await waitFor(() => {
        expect(screen.getByText(/custom/i)).toBeInTheDocument();
      });
    });

    it('should display empty state when no results', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: [] });

      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'Xyz');

      await waitFor(() => {
        expect(screen.getByText(/aucun ingrédient trouvé/i)).toBeInTheDocument();
      });
    });
  });

  describe('Sélection', () => {
    it('should call onSelect when clicking on result', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: mockIngredients });

      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'Far');

      await waitFor(() => {
        expect(screen.getByText('Farine T65')).toBeInTheDocument();
      });

      const result = screen.getByText('Farine T65');
      await user.click(result);

      expect(mockOnSelect).toHaveBeenCalledWith(mockIngredients[0]);
    });

    it('should close dropdown after selection', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: mockIngredients });

      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'Far');

      await waitFor(() => {
        expect(screen.getByText('Farine T65')).toBeInTheDocument();
      });

      const result = screen.getByText('Farine T65');
      await user.click(result);

      expect(screen.queryByText('Farine T55')).not.toBeInTheDocument();
    });

    it('should clear input after selection if clearOnSelect=true', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: mockIngredients });

      render(<IngredientAutocomplete onSelect={mockOnSelect} clearOnSelect />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'Far');

      await waitFor(() => {
        expect(screen.getByText('Farine T65')).toBeInTheDocument();
      });

      const result = screen.getByText('Farine T65');
      await user.click(result);

      expect(input.value).toBe('');
    });
  });

  describe('Keyboard navigation', () => {
    it('should navigate results with arrow keys', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: mockIngredients });

      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'Far');

      await waitFor(() => {
        expect(screen.getByText('Farine T65')).toBeInTheDocument();
      });

      // Arrow Down
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      
      const firstResult = screen.getByText('Farine T65').closest('button');
      expect(firstResult).toHaveClass('bg-gray-100');

      // Arrow Down again
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      
      const secondResult = screen.getByText('Farine T55').closest('button');
      expect(secondResult).toHaveClass('bg-gray-100');
    });

    it('should select with Enter key', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: mockIngredients });

      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'Far');

      await waitFor(() => {
        expect(screen.getByText('Farine T65')).toBeInTheDocument();
      });

      // Arrow Down to select first
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      
      // Enter to validate
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnSelect).toHaveBeenCalledWith(mockIngredients[0]);
    });

    it('should close dropdown with Escape key', async () => {
      const user = userEvent.setup();
      api.get.mockResolvedValue({ data: mockIngredients });

      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'Far');

      await waitFor(() => {
        expect(screen.getByText('Farine T65')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'Escape' });

      expect(screen.queryByText('Farine T65')).not.toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should display error message on API failure', async () => {
      const user = userEvent.setup();
      api.get.mockRejectedValue(new Error('Network error'));

      render(<IngredientAutocomplete onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/rechercher un ingrédient/i);
      await user.type(input, 'Far');

      await waitFor(() => {
        expect(screen.getByText(/erreur lors de la recherche/i)).toBeInTheDocument();
      });
    });
  });
});
