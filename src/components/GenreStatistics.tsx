import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { genres } from '../data/genres';
import { useFavorites } from '../hooks/useFavorites';
import './GenreStatistics.css';

export const GenreStatistics = () => {
  const { favoriteGenres } = useFavorites();

  const categoryData = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    genres.forEach(genre => {
      categoryCount[genre.category] = (categoryCount[genre.category] || 0) + 1;
    });
    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  }, []);

  const favoriteCategoryData = useMemo(() => {
    if (favoriteGenres.length === 0) return [];
    const categoryCount: Record<string, number> = {};
    favoriteGenres.forEach((genreId: string) => {
      const genre = genres.find(g => g.id === genreId);
      if (genre) {
        categoryCount[genre.category] = (categoryCount[genre.category] || 0) + 1;
      }
    });
    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  }, [favoriteGenres]);

  const characteristicsData = useMemo(() => {
    const charCount: Record<string, number> = {};
    genres.forEach(genre => {
      genre.characteristics.forEach(char => {
        charCount[char] = (charCount[char] || 0) + 1;
      });
    });
    return Object.entries(charCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  }, []);

  const COLORS = ['#000000', '#666666', '#999999', '#cccccc', '#e0e0e0'];

  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <h2>Genre Statistics</h2>
        <p>Visual insights into music genres and your preferences</p>
        <div className="statistics-explanation">
          <p>📊 <strong>Genres by Category:</strong> Shows how many genres exist in each category (Rock, Electronic, Hip-Hop, etc.)</p>
          <p>🎯 <strong>Your Favorite Categories:</strong> Distribution of your favorite genres by category (only shown if you have favorites)</p>
          <p>🎵 <strong>Most Common Characteristics:</strong> The most frequent musical characteristics across all genres</p>
          <p>📈 <strong>Summary:</strong> Quick stats about total genres, categories, and your favorites</p>
        </div>
      </div>

      <div className="statistics-grid">
        {/* Category Distribution */}
        <div className="stat-card">
          <h3>Genres by Category</h3>
          <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--color-surface)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <Bar dataKey="value" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* Favorite Categories */}
        {favoriteGenres.length > 0 && (
          <div className="stat-card">
            <h3>Your Favorite Categories</h3>
            <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={favoriteCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => props.name ? `${props.name} ${((props.percent || 0) * 100).toFixed(0)}%` : ''}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {favoriteCategoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top Characteristics */}
        <div className="stat-card">
          <h3>Most Common Characteristics</h3>
          <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={characteristicsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} width={100} />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--color-surface)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <Bar dataKey="value" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="stat-card stat-summary">
          <h3>Summary</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">Total Genres</span>
              <span className="summary-value">{genres.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Categories</span>
              <span className="summary-value">{categoryData.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Favorites</span>
              <span className="summary-value">{favoriteGenres.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Avg Characteristics</span>
              <span className="summary-value">
                {Math.round(genres.reduce((acc, g) => acc + g.characteristics.length, 0) / genres.length)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

