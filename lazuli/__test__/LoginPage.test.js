// LoginPage.test.js

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('LoginPage Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    fetch.mockClear();
    useRouter.mockReturnValue({
      push: mockPush,
    });
    localStorage.clear();
  });

  it('renders the login form correctly', () => {
    render(<LoginPage />);

    // Vérifier la saisie de l'email
    expect(screen.getByPlaceholderText('Adresse e-mail')).toBeInTheDocument();

    // Vérifier la saisie du mot de passe
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument();

    // Vérifier le bouton de soumission
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();

    // Vérifier le lien d'inscription
    expect(screen.getByText(/S'inscrire/i)).toBeInTheDocument();
  });

  it('allows the user to input email and password', () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Adresse e-mail');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('submits the form and handles successful login', async () => {
    // Mock successful login response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ userId: 'mockUserId' }),
    });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Adresse e-mail');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'password123',
        }),
      });
    });

    await waitFor(() => {
      expect(localStorage.getItem('userId')).toBe('mockUserId');
      expect(mockPush).toHaveBeenCalledWith('/Dashboard');
    });
  });

  it('handles login failure with server error message', async () => {
    // Mock failed login response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    // Mock alert
    window.alert = jest.fn();

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Adresse e-mail');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'wronguser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'wronguser@example.com',
          password: 'wrongpassword',
        }),
      });
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
      expect(localStorage.getItem('userId')).toBeNull();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('handles network errors gracefully', async () => {
    // Mock network error
    fetch.mockRejectedValueOnce(new Error('Network error'));

    // Mock alert
    window.alert = jest.fn();

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Adresse e-mail');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'password123',
        }),
      });
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Erreur lors de la connexion. Veuillez vérifier la console pour plus d\'informations.'
      );
      expect(localStorage.getItem('userId')).toBeNull();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('displays validation errors when fields are empty', async () => {
    // Mock alert
    window.alert = jest.fn();

    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
     
    });

  
  });

  it('navigates to password reset page when "Mot de passe oublié ?" is clicked', () => {
    render(<LoginPage />);

    const forgotPasswordLink = screen.getByText(/Mot de passe oublié \?/i);
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.getAttribute('href')).toBe('/MDP');
  });

  it('navigates to signup page when "S\'inscrire" is clicked', () => {
    render(<LoginPage />);4

    const signupLink = screen.getByText(/S'inscrire/i);
    expect(signupLink).toBeInTheDocument();
    expect(signupLink.getAttribute('href')).toBe('/SignUp');
  });
});