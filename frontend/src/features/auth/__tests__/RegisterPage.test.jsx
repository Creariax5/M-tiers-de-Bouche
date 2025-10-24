import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../RegisterPage';
import api from '../../../lib/api';

// Mock du module API
vi.mock('../../../lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock du router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  };
});

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('affiche le formulaire d\'inscription complet', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email professionnel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^prénom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^nom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nom de l'entreprise/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^mot de passe$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
  });

  test('affiche le message 14 jours d\'essai gratuit', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/14 jours d'essai gratuit/i)).toBeInTheDocument();
    expect(screen.getByText(/sans carte bancaire/i)).toBeInTheDocument();
  });

  test('affiche le lien vers la page login', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const loginLink = screen.getByRole('link', { name: /se connecter/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('valide que les mots de passe correspondent', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText(/^mot de passe$/i);
    const confirmInput = screen.getByLabelText(/confirmer le mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

    await user.type(passwordInput, 'password123');
    await user.type(confirmInput, 'different');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/ne correspondent pas/i)).toBeInTheDocument();
    });
  });

  test('valide les champs requis', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
    });
  });

  test('soumet le formulaire avec succès', async () => {
    const user = userEvent.setup({ delay: null });
    api.post.mockResolvedValue({ data: { success: true } });

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    // Remplir tous les champs
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^prénom$/i), 'John');
    await user.type(screen.getByLabelText(/^nom$/i), 'Doe');
    await user.type(screen.getByLabelText(/entreprise/i), 'Test Company');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'password123');

    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        company: 'Test Company',
        password: 'password123',
      });
    });
  });

  test('affiche écran de succès après inscription', async () => {
    const user = userEvent.setup({ delay: null });
    api.post.mockResolvedValue({ data: { success: true } });

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    // Remplir et soumettre
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^prénom$/i), 'John');
    await user.type(screen.getByLabelText(/^nom$/i), 'Doe');
    await user.type(screen.getByLabelText(/entreprise/i), 'Test Company');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'password123');

    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText(/inscription réussie/i)).toBeInTheDocument();
      expect(screen.getByText(/redirection/i)).toBeInTheDocument();
    });
  });

  test('redirige vers login après 2 secondes', async () => {
    vi.useFakeTimers(); // Active fake timers pour ce test uniquement
    
    const user = userEvent.setup({ delay: null });
    api.post.mockResolvedValue({ data: { success: true } });

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    // Remplir et soumettre
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^prénom$/i), 'John');
    await user.type(screen.getByLabelText(/^nom$/i), 'Doe');
    await user.type(screen.getByLabelText(/entreprise/i), 'Test Company');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmer/i), 'password123');

    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    // Attendre l'écran de succès (avec fake timers, waitFor utilise des timeouts virtuels)
    await vi.waitFor(() => {
      expect(screen.getByText(/inscription réussie/i)).toBeInTheDocument();
    });

    // Avancer de 2 secondes pour déclencher le setTimeout
    await vi.advanceTimersByTimeAsync(2000);

    // Vérifier que navigate a été appelé
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    
    vi.useRealTimers(); // Restaure les timers réels
  });

  test('affiche erreur si email déjà utilisé', async () => {
    const user = userEvent.setup({ delay: null });
    api.post.mockRejectedValue({
      response: {
        data: { message: 'Email déjà utilisé' },
      },
    });

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    // Utiliser getAllByLabelText pour les labels ambigus
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/^prénom$/i), 'John');
    await user.type(screen.getByLabelText(/^nom$/i), 'Doe');
    await user.type(screen.getByLabelText(/entreprise/i), 'Test Company');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmer/i), 'password123');

    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText(/email déjà utilisé/i)).toBeInTheDocument();
    });
  }, 10000); // Timeout de 10 secondes
});
