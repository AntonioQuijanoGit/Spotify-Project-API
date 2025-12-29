import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.favoriteGenres).toEqual([]);
    expect(result.current.favorites.tracks).toEqual([]);
  });

  it('loads favorites from localStorage on init', () => {
    const savedFavorites = {
      genres: ['rock', 'jazz'],
      tracks: ['track1', 'track2'],
    };
    localStorage.setItem('favorites', JSON.stringify(savedFavorites));

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favoriteGenres).toEqual(['rock', 'jazz']);
    expect(result.current.favorites.tracks).toEqual(['track1', 'track2']);
  });

  it('adds genre to favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleGenreFavorite('rock');
    });

    expect(result.current.isGenreFavorite('rock')).toBe(true);
    expect(result.current.favoriteGenres).toContain('rock');
  });

  it('removes genre from favorites when toggled again', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleGenreFavorite('rock');
    });

    expect(result.current.isGenreFavorite('rock')).toBe(true);

    act(() => {
      result.current.toggleGenreFavorite('rock');
    });

    expect(result.current.isGenreFavorite('rock')).toBe(false);
    expect(result.current.favoriteGenres).not.toContain('rock');
  });

  it('saves favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleGenreFavorite('rock');
      result.current.toggleTrackFavorite('track1');
    });

    const saved = localStorage.getItem('favorites');
    expect(saved).toBeTruthy();

    if (saved) {
      const parsed = JSON.parse(saved);
      expect(parsed.genres).toContain('rock');
      expect(parsed.tracks).toContain('track1');
    }
  });

  it('adds multiple genres to favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleGenreFavorite('rock');
      result.current.toggleGenreFavorite('jazz');
      result.current.toggleGenreFavorite('pop');
    });

    expect(result.current.isGenreFavorite('rock')).toBe(true);
    expect(result.current.isGenreFavorite('jazz')).toBe(true);
    expect(result.current.isGenreFavorite('pop')).toBe(true);
    expect(result.current.favoriteGenres).toHaveLength(3);
  });

  it('clears all favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleGenreFavorite('rock');
      result.current.toggleTrackFavorite('track1');
    });

    expect(result.current.favoriteGenres.length).toBeGreaterThan(0);

    act(() => {
      result.current.clearFavorites();
    });

    expect(result.current.favoriteGenres).toEqual([]);
    expect(result.current.favorites.tracks).toEqual([]);
  });

  it('handles invalid localStorage data gracefully', () => {
    localStorage.setItem('favorites', 'invalid json');

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favoriteGenres).toEqual([]);
    expect(result.current.favorites.tracks).toEqual([]);
  });
});


