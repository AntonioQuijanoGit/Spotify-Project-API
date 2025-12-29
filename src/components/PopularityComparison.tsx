import { useMemo } from 'react';
import { genres } from '../data/genres';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './PopularityComparison.css';

export const PopularityComparison = () => {
  // Simulate popularity data (in a real app, this would come from Spotify API)
  const popularityData = useMemo(() => {
    return genres
      .map(genre => ({
        name: genre.name,
        popularity: Math.floor(Math.random() * 100), // Simulated
        tracks: Math.floor(Math.random() * 1000) + 100,
        listeners: Math.floor(Math.random() * 1000000) + 10000,
      }))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 15);
  }, []);

  const categoryPopularity = useMemo(() => {
    const categoryData: Record<string, { count: number; totalPopularity: number }> = {};
    
    genres.forEach(genre => {
      if (!categoryData[genre.category]) {
        categoryData[genre.category] = { count: 0, totalPopularity: 0 };
      }
      categoryData[genre.category].count++;
      categoryData[genre.category].totalPopularity += Math.floor(Math.random() * 100);
    });

    return Object.entries(categoryData).map(([category, data]) => ({
      category,
      avgPopularity: Math.round(data.totalPopularity / data.count),
      genres: data.count,
    })).sort((a, b) => b.avgPopularity - a.avgPopularity);
  }, []);

  return (
    <div className="popularity-container">
      <div className="popularity-header">
        <h2>Popularity Trends</h2>
        <p>Compare genre popularity and trends</p>
      </div>

      <div className="popularity-charts">
        <div className="popularity-chart-card">
          <h3>Top Genres by Popularity</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={popularityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} 
                width={120}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--color-surface)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <Bar dataKey="popularity" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="popularity-chart-card">
          <h3>Average Popularity by Category</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryPopularity}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--color-surface)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <Bar dataKey="avgPopularity" fill="var(--color-accent-secondary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};




