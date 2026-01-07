import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';
import * as useThemeHook from '../../hooks/useTheme';

describe('ThemeToggle', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders light mode icon when theme is light', () => {
    vi.spyOn(useThemeHook, 'useTheme').mockReturnValue({
      theme: 'light' as const,
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
  });

  it('renders dark mode icon when theme is dark', () => {
    vi.spyOn(useThemeHook, 'useTheme').mockReturnValue({
      theme: 'dark' as const,
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to light mode/i });
    expect(button).toBeInTheDocument();
  });

  it('calls toggleTheme when button is clicked', () => {
    vi.spyOn(useThemeHook, 'useTheme').mockReturnValue({
      theme: 'light' as const,
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    fireEvent.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-label for accessibility', () => {
    vi.spyOn(useThemeHook, 'useTheme').mockReturnValue({
      theme: 'light' as const,
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    expect(
      screen.getByRole('button', { name: /switch to dark mode/i })
    ).toBeInTheDocument();
  });
});





