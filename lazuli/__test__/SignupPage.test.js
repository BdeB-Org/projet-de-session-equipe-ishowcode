// SignupPage.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from './SignupPage';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SignupPage', () => {
  let pushMock;

  beforeEach(() => {
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Rend le formulaire correctement', () => {
    render(<SignupPage />);

    expect(screen.getByPlaceholderText('Prénom')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nom')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Adresse e-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirmez le mot de passe')).toBeInTheDocument();
  });


//2 mot de passe different
  test('Affiche un message d\'erreur si les mots de passe ne correspondent pas', async () => {
    render(<SignupPage />);

    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'era' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'nra' } });
    fireEvent.change(screen.getByPlaceholderText('Adresse e-mail'), { target: { value: 'era.nra@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: '123Qwerty$!' } });
    fireEvent.change(screen.getByPlaceholderText('Confirmez le mot de passe'), { target: { value: '123Ytrewq$!' } });

    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));

    await waitFor(() => expect(screen.getByText(/Les mots de passe ne correspondent pas/i)).toBeInTheDocument());
  });

  //mdp courte

  test('Affiche un message d\'erreur si le mot de passe est trop court', async () => {
    render(<SignupPage />);

    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'era' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'nra' } });
    fireEvent.change(screen.getByPlaceholderText('Adresse e-mail'), { target: { value: 'era.nra@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'short' } });
    fireEvent.change(screen.getByPlaceholderText('Confirmez le mot de passe'), { target: { value: 'short' } });

    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));

    await waitFor(() => expect(screen.getByText(/Le mot de passe doit contenir au moins 8 caractères/i)).toBeInTheDocument());
  });


  //changement de page
  test('Redirige vers la page de connexion après une inscription réussie', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ userId: '12345' }),
    });

    render(<SignupPage />);

    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'era' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'nra' } });
    fireEvent.change(screen.getByPlaceholderText('Adresse e-mail'), { target: { value: 'era.nra@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: '123Qwerty$!' } });
    fireEvent.change(screen.getByPlaceholderText('Confirmez le mot de passe'), { target: { value: '123Qwerty$!' } });

    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/login'));
  });

  //email deja utilise
  test('Affiche un message d\'erreur si l\'email est déjà utilisé', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Cet email est déjà utilisé.' }),
    });

    render(<SignupPage />);

    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'era' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'nra' } });
    fireEvent.change(screen.getByPlaceholderText('Adresse e-mail'), { target: { value: 'era.nra@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: '123Qwerty$!' } });
    fireEvent.change(screen.getByPlaceholderText('Confirmez le mot de passe'), { target: { value: '123Qwerty$!' } });

    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));

    await waitFor(() => expect(screen.getByText(/Cet email est déjà utilisé./i)).toBeInTheDocument());
  });
});
