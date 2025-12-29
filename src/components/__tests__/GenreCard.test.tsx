import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenreCard } from '../GenreCard';
import type { Genre } from '../../types';

const mockGenre: Genre = {
  id: 'rock',
  name: 'Rock',
  category: 'rock',
  description: 'A genre of popular music',
  characteristics: ['Guitar-driven', 'Energetic', 'Rebellious'],
  originYear: '1950s',
  keyArtists: ['Elvis Presley', 'The Beatles'],
  relatedGenres: ['punk', 'metal'],
  color: '#ff0000',
  spotifyGenre: 'rock',
};

describe('GenreCard', () => {
  it('renders genre information correctly', () => {
    const onClick = vi.fn();
    render(<GenreCard genre={mockGenre} onClick={onClick} />);

    expect(screen.getByText('Rock')).toBeInTheDocument();
    expect(screen.getByText('A genre of popular music')).toBeInTheDocument();
    expect(screen.getByText('rock')).toBeInTheDocument();
    expect(screen.getByText('1950s')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const onClick = vi.fn();
    const { container } = render(<GenreCard genre={mockGenre} onClick={onClick} />);

    const card = container.querySelector('article[role="button"]') as HTMLElement;
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', () => {
    const onClick = vi.fn();
    const { container } = render(<GenreCard genre={mockGenre} onClick={onClick} />);

    const card = container.querySelector('article[role="button"]') as HTMLElement;
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space key is pressed', () => {
    const onClick = vi.fn();
    const { container } = render(<GenreCard genre={mockGenre} onClick={onClick} />);

    const card = container.querySelector('article[role="button"]') as HTMLElement;
    fireEvent.keyDown(card, { key: ' ' });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('displays favorite button when onToggleFavorite is provided', () => {
    const onClick = vi.fn();
    const onToggleFavorite = vi.fn();
    render(
      <GenreCard
        genre={mockGenre}
        onClick={onClick}
        onToggleFavorite={onToggleFavorite}
      />
    );

    const favoriteButton = screen.getByRole('button', {
      name: /add rock to favorites/i,
    });
    expect(favoriteButton).toBeInTheDocument();
  });

  it('calls onToggleFavorite when favorite button is clicked', () => {
    const onClick = vi.fn();
    const onToggleFavorite = vi.fn();
    render(
      <GenreCard
        genre={mockGenre}
        onClick={onClick}
        onToggleFavorite={onToggleFavorite}
      />
    );

    const favoriteButton = screen.getByRole('button', {
      name: /add rock to favorites/i,
    });
    fireEvent.click(favoriteButton);

    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows favorite active state when isFavorite is true', () => {
    const onClick = vi.fn();
    const onToggleFavorite = vi.fn();
    render(
      <GenreCard
        genre={mockGenre}
        onClick={onClick}
        onToggleFavorite={onToggleFavorite}
        isFavorite={true}
      />
    );

    const favoriteButton = screen.getByRole('button', {
      name: /remove rock from favorites/i,
    });
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveClass('favorite-active');
  });

  it('displays up to 3 characteristics', () => {
    const genreWithManyChars: Genre = {
      ...mockGenre,
      characteristics: ['Char1', 'Char2', 'Char3', 'Char4', 'Char5'],
    };
    const onClick = vi.fn();
    render(<GenreCard genre={genreWithManyChars} onClick={onClick} />);

    expect(screen.getByText('Char1')).toBeInTheDocument();
    expect(screen.getByText('Char2')).toBeInTheDocument();
    expect(screen.getByText('Char3')).toBeInTheDocument();
    expect(screen.queryByText('Char4')).not.toBeInTheDocument();
    expect(screen.queryByText('Char5')).not.toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    const onClick = vi.fn();
    const { container } = render(<GenreCard genre={mockGenre} onClick={onClick} />);

    const card = container.querySelector('article[role="button"]') as HTMLElement;
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-label', 'Explore Rock genre');
  });
});

