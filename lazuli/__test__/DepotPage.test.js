import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilPage from './SignupPage.test';
import { useRouter } from 'next/navigation';

//Test pour la page depot
/**
 * Test de depot, retirer et deconnecter
 */


jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('ProfilPage Component', () => {
  beforeEach(() => {
    localStorage.clear();
    fetch.mockClear();
    useRouter.mockClear();
  });

  it('should render correctly and display user data', async () => {
    localStorage.setItem('userId', 'mockUserId');

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: 'era n',
        email: 'era@gmail.com',
        balance: 1000,
        currency: 'USD',
      }),
    });

    render(<ProfilPage />);

    await waitFor(() => screen.getByText('era n'));
    await waitFor(() => screen.getByText('era@gmail.com'));

    // verification d'affichages
    expect(screen.getByText('Nom: era n')).toBeInTheDocument();
    expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Solde: 1,000.00 $ (USD)')).toBeInTheDocument();
  });

  it('should handle deposit correctly', async () => {
    localStorage.setItem('userId', 'mockUserId');

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: 'era n',
        email: 'era@gmail.com',
        balance: 1000,
        currency: 'USD',
      }),
    });

    render(<ProfilPage />);


    await waitFor(() => screen.getByText('era n'));

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Balance updated successfully.' }),
    });

    // Simulation d'entrer d'argent
    const depositInput = screen.getByPlaceholderText('Montant du dépôt');
    fireEvent.change(depositInput, { target: { value: '500' } });

    const depositButton = screen.getByText('Déposer');
    fireEvent.click(depositButton);

    await waitFor(() => screen.getByText('Déposé avec succès: 500'));

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/updateBalance'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('newBalance'),
      })
    );
  });

  it('should handle logout correctly', async () => {
    localStorage.setItem('userId', 'mockUserId');

    //data de profile
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: 'era n',
        email: 'era@gmail.com',
        balance: 1000,
        currency: 'USD',
      }),
    });

    render(<ProfilPage />);

    await waitFor(() => screen.getByText('John Doe'));

    // simulation de clicker le bouton deconnecter
    const logoutButton = screen.getByText('Déconnecter');
    fireEvent.click(logoutButton);

    expect(useRouter).toHaveBeenCalledWith();
  });

  it('should handle balance reset correctly', async () => {

    localStorage.setItem('userId', 'mockUserId');

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: 'era n',
        email: 'era@gmail.com',
        balance: 1000,
        currency: 'USD',
      }),
    });

    render(<ProfilPage />);

    await waitFor(() => screen.getByText('era n'));

    // Simulation de réinitialiser le solde
    const resetButton = screen.getByText('Réinitialiser le Solde');
    fireEvent.click(resetButton);

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Balance updated successfully.' }),
    });

    // message de success
    await waitFor(() => screen.getByText('Le solde a été réinitialisé à 0.'));


    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/updateBalance'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('newBalance'),
      })
    );
  });
});
