# 🎵 Music Genre Explorer

A modern, feature-rich web application for exploring music genres, discovering artists, and listening to previews from Spotify. Built with React, TypeScript, and Vite.

![React](https://img.shields.io/badge/React-19.2-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.2-purple.svg)

## ✨ Features

### 🎸 Core Features
- **30+ Music Genres**: Explore rock, electronic, hip-hop, jazz, pop, and more
- **Spotify Integration**: Real-time data from Spotify Web API
- **Audio Previews**: Listen to 30-second track previews
- **Advanced Search**: Search for artists, albums, and tracks
- **Playlists Discovery**: Browse featured and genre-based playlists

### 🎨 User Experience
- **Dark/Light Mode**: Beautiful theme switching
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Offline Support**: Service Worker for offline functionality

### 🎯 Advanced Features
- **Radio Mode**: Continuous playback across genres
- **Smart Recommendations**: Personalized genre suggestions
- **Genre Comparison**: Compare multiple genres side-by-side
- **Statistics Dashboard**: Visual analytics and genre insights
- **Timeline View**: Explore genre evolution through history
- **Discovery Mode**: Daily random genre recommendations
- **Focus Mode**: Curated music for deep work, study, and concentration
- **Mood Search**: Find music that matches your current mood or activity
- **Listening History**: Track your listening history and most played genres
- **Track Comparison**: Compare audio features of multiple tracks side-by-side
- **Audio Filters**: Filter tracks by BPM, energy, danceability, and more
- **Favorites System**: Save and filter favorite genres
- **Notes & Tags**: Add personal notes and tags to genres
- **Playlist Manager**: Create and manage local playlists
- **Export Data**: Export favorites and playlists

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Spotify API credentials (Client ID and Secret)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd music-explorer
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Spotify API** (Optional - defaults provided)
```bash
# Create a .env file in the root directory
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🐳 Docker

### Quick Start

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The app will be available at `http://localhost:3000`

### Manual Docker Build

```bash
# Build image
docker build -t music-explorer .

# Run container
docker run -d -p 3000:80 --name music-explorer-app music-explorer
```

See `Dockerfile` and `docker-compose.yml` for more details.

## 📁 Project Structure

```
music-explorer/
├── src/
│   ├── components/      # React components (60+ components)
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions (Spotify API, exports, moods, etc.)
│   ├── data/           # Static data (genres)
│   └── App.tsx         # Main application component
├── public/             # Static assets
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
└── package.json        # Dependencies and scripts
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Tech Stack

- **React 19.2** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool and dev server
- **Recharts** - Data visualization
- **Vis-Network** - Network/graph visualizations
- **Spotify Web API** - Music data

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

All components adapt gracefully to different screen sizes.

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- Focus management in modals
- Skip links for navigation
- ARIA labels throughout

## 🔐 Security Notes

**Important**: The app currently uses hardcoded Spotify credentials for Client Credentials flow. For production:
1. Move credentials to environment variables
2. Use a backend proxy for the Client Secret
3. Implement rate limiting

## 🎯 Key Features Explained

### Radio Mode
Automatically plays tracks from different genres. Starts with user interaction, then continues automatically.

### Smart Recommendations
Suggests genres based on your favorites using Spotify's recommendation algorithm.

### Genre Comparison
Compare characteristics, popularity, and related genres side-by-side.

### Discovery Mode
Discover 6 random genres daily that you haven't favorited yet.

### Playlists
Browse featured playlists and search by genre. All data from Spotify's curated playlists.

### Focus Mode
Curated music designed for deep work, study, and concentration. Automatically filters tracks by low-medium energy and optimal focus characteristics.

### Mood Search
Search for music based on your mood or activity. Choose from 10 different moods including study, workout, relax, party, focus, sleep, happy, sad, energetic, and calm.

### Listening History
Track all the music you've listened to, view your most played genres, and see statistics about your listening habits.

### Track Comparison
Compare audio features (energy, danceability, tempo, valence) of multiple tracks side-by-side with visual charts.

### Audio Filters
Filter tracks by audio characteristics including BPM (tempo), energy level, danceability, and musical positivity (valence).

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)





