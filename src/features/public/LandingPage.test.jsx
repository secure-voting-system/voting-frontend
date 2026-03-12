import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './LandingPage';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../shared/components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">ThemeToggle</div>
}));

describe('LandingPage', () => {
  const renderLandingPage = () => {
    return render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
  };

  it('renders the branding title', () => {
    renderLandingPage();
    expect(screen.getByRole('heading', { level: 2, name: /^Secure Voting$/i })).toBeInTheDocument();
  });

  it('renders the hero title', () => {
    renderLandingPage();
    expect(screen.getByText(/Democracy in Every Vote/i)).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    renderLandingPage();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
  });

  it('renders hero action buttons', () => {
    renderLandingPage();
    expect(screen.getByRole('button', { name: /Start Voting/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Demo/i })).toBeInTheDocument();
  });

  it('has correct links for navigation', () => {
    renderLandingPage();
    const loginLink = screen.getByRole('link', { name: /Login/i });
    expect(loginLink).toHaveAttribute('href', '/login');

    const getStartedLink = screen.getByRole('link', { name: /Get Started/i });
    expect(getStartedLink).toHaveAttribute('href', '/register');
  });

  it('renders feature cards', () => {
    renderLandingPage();
    expect(screen.getByText(/Secure & Transparent/i)).toBeInTheDocument();
    expect(screen.getByText(/Easy to Use/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-time Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy First/i)).toBeInTheDocument();
  });
});
