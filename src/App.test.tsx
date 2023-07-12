import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders stock summary heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/Stock Summary/i);
  expect(linkElement).toBeInTheDocument();
});
