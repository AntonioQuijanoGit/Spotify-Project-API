import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Spotify Utils', () => {
  beforeEach(async () => {
    // Clear module cache to reset cached token
    vi.resetModules();
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  describe('getSpotifyToken', () => {
    it('fetches a new token when cache is empty', async () => {
      const { getSpotifyToken } = await import('../spotify');
      const mockToken = 'test-access-token';
      const mockResponse = {
        ok: true,
        json: async () => ({
          access_token: mockToken,
          expires_in: 3600,
        }),
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const token = await getSpotifyToken();

      expect(token).toBe(mockToken);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        })
      );
    });

    it('throws error when fetch fails', async () => {
      const { getSpotifyToken } = await import('../spotify');
      const mockResponse = {
        ok: false,
        status: 401,
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      await expect(getSpotifyToken()).rejects.toThrow('Failed to get Spotify token');
    });

    it('throws error when network fails', async () => {
      const { getSpotifyToken } = await import('../spotify');
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(getSpotifyToken()).rejects.toThrow();
    });
  });
});

