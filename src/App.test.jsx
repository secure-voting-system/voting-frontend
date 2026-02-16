import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Since App likely redirects to login or shows a landing page, we can check for common elements
    // For now, just ensuring it renders is a good first step.
    // If LandingPage is default, look for "Democracy in Every Vote"
    // If Login is default, look for "Login"
  });
});
