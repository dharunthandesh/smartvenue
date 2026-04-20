import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mocking framer-motion to avoid JSDOM compatibility issues with animations
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }) => <nav {...props}>{children} nav</nav>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    header: ({ children, ...props }) => <header {...props}>{children}</header>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('SmartVenue AI Frontend', () => {
  it('renders the sidebar with branding', () => {
    render(<App />);
    expect(screen.getAllByText(/SmartVenue/i)[0]).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    render(<App />);
    expect(screen.getAllByText(/Live Map/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Queue Status/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Navigation/i)[0]).toBeInTheDocument();
  });
});
