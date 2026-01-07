import type { Genre } from '../types';

export function exportToJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(genres: Genre[], filename: string) {
  const headers = ['Name', 'Category', 'Description', 'Characteristics', 'Origin Year', 'Key Artists'];
  const rows = genres.map(genre => [
    genre.name,
    genre.category,
    genre.description.replace(/"/g, '""'), // Escape quotes
    genre.characteristics.join('; '),
    genre.originYear || '',
    (genre.keyArtists || []).join('; '),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportFavoritesToJSON(favoriteGenres: string[], allGenres: Genre[]) {
  const favorites = allGenres.filter(g => favoriteGenres.includes(g.id));
  exportToJSON(favorites, 'favorite-genres');
}

export function exportFavoritesToCSV(favoriteGenres: string[], allGenres: Genre[]) {
  const favorites = allGenres.filter(g => favoriteGenres.includes(g.id));
  exportToCSV(favorites, 'favorite-genres');
}








