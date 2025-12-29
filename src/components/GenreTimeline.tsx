import { useMemo } from 'react';
import { genres } from '../data/genres';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './GenreTimeline.css';

export const GenreTimeline = () => {
  const timelineData = useMemo(() => {
    const decades: Record<string, number> = {};
    
    genres.forEach(genre => {
      if (genre.originYear) {
        // Extract numeric year from strings like "1960s" or "late 1970s"
        const yearMatch = genre.originYear.match(/\d{4}/);
        if (yearMatch) {
          const year = parseInt(yearMatch[0]);
          if (!isNaN(year) && year > 1800 && year < 2100) {
            const decade = Math.floor(year / 10) * 10;
            decades[decade] = (decades[decade] || 0) + 1;
          }
        }
      }
    });

    return Object.entries(decades)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([decade, count]) => ({
        decade: `${decade}s`,
        year: parseInt(decade),
        genres: count,
      }));
  }, []);

  const genresByDecade = useMemo(() => {
    const byDecade: Record<string, typeof genres> = {};
    
    genres.forEach(genre => {
      if (genre.originYear) {
        // Extract numeric year from strings like "1960s" or "late 1970s"
        const yearMatch = genre.originYear.match(/\d{4}/);
        if (yearMatch) {
          const year = parseInt(yearMatch[0]);
          if (!isNaN(year) && year > 1800 && year < 2100) {
            const decade = Math.floor(year / 10) * 10;
            const key = `${decade}s`;
            if (!byDecade[key]) byDecade[key] = [];
            byDecade[key].push(genre);
          }
        }
      }
    });

    return Object.entries(byDecade)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([decade, genreList]) => {
        const getYear = (originYear?: string): number => {
          if (!originYear) return 0;
          const yearMatch = originYear.match(/\d{4}/);
          if (yearMatch) {
            const year = parseInt(yearMatch[0]);
            return isNaN(year) ? 0 : year;
          }
          return 0;
        };
        
        return {
          decade,
          genres: genreList.sort((a, b) => getYear(a.originYear) - getYear(b.originYear)),
        };
      });
  }, []);

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2>Music Genre Evolution</h2>
        <p>Explore how genres emerged through the decades</p>
      </div>

      <div className="timeline-chart">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="decade" 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              label={{ value: 'Genres', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'var(--color-surface)', 
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="genres" 
              stroke="var(--color-accent)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-accent)', r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="timeline-decades">
        {genresByDecade.map(({ decade, genres: decadeGenres }) => (
          <div key={decade} className="timeline-decade">
            <h3 className="decade-title">{decade}</h3>
            <div className="decade-genres">
              {decadeGenres.map(genre => (
                <div
                  key={genre.id}
                  className="decade-genre-badge"
                  style={{ borderLeftColor: genre.color }}
                >
                  <span className="genre-year">{genre.originYear}</span>
                  <span className="genre-name">{genre.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};




