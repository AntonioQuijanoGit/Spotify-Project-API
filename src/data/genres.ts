import type { Genre } from '../types';

export const genres: Genre[] = [
  // ROCK
  {
    id: 'classic-rock',
    name: 'Classic Rock',
    category: 'rock',
    description: 'The foundational sound of rock music from the 1960s-80s, characterized by electric guitars, strong rhythms, and memorable melodies.',
    characteristics: ['Guitar-driven', 'Blues influence', 'Live energy', 'Anthemic'],
    originYear: '1960s',
    keyArtists: ['Led Zeppelin', 'The Rolling Stones', 'Queen'],
    relatedGenres: ['hard-rock', 'blues-rock', 'alternative'],
    color: '#dc2626',
    spotifyGenre: 'classic rock',
  },
  {
    id: 'alternative',
    name: 'Alternative Rock',
    category: 'rock',
    description: 'Non-mainstream rock that emerged in the 1980s and became hugely popular in the 1990s.',
    characteristics: ['Experimental', 'Diverse', 'Independent spirit'],
    originYear: '1980s',
    keyArtists: ['Nirvana', 'Radiohead', 'R.E.M.'],
    relatedGenres: ['indie-rock', 'grunge', 'post-punk'],
    color: '#ef4444',
    spotifyGenre: 'alternative',
  },
  {
    id: 'punk',
    name: 'Punk',
    category: 'rock',
    description: 'Fast, hard-edged music with short songs, stripped-down instrumentation, and often political lyrics.',
    characteristics: ['Raw energy', 'DIY ethos', 'Short songs', 'Rebellious'],
    originYear: '1970s',
    keyArtists: ['The Ramones', 'Sex Pistols', 'The Clash'],
    relatedGenres: ['post-punk', 'pop-punk', 'hardcore'],
    color: '#f97316',
    spotifyGenre: 'punk',
  },
  
  // ELECTRONIC
  {
    id: 'house',
    name: 'House',
    category: 'electronic',
    description: 'Four-on-the-floor dance music that originated in Chicago in the early 1980s.',
    characteristics: ['4/4 beat', 'Repetitive', 'Soulful', 'Dance-focused'],
    originYear: '1980s',
    keyArtists: ['Daft Punk', 'Frankie Knuckles', 'Disclosure'],
    relatedGenres: ['techno', 'deep-house', 'edm'],
    color: '#0891b2',
    spotifyGenre: 'house',
  },
  {
    id: 'techno',
    name: 'Techno',
    category: 'electronic',
    description: 'Repetitive, hypnotic electronic music that emerged from Detroit in the mid-1980s.',
    characteristics: ['Repetitive beats', '120-150 BPM', 'Minimal', 'Futuristic'],
    originYear: '1980s',
    keyArtists: ['Carl Craig', 'Jeff Mills', 'Richie Hawtin'],
    relatedGenres: ['house', 'trance', 'industrial'],
    color: '#06b6d4',
    spotifyGenre: 'techno',
  },
  {
    id: 'ambient',
    name: 'Ambient',
    category: 'electronic',
    description: 'Atmospheric music that emphasizes tone and atmosphere over traditional musical structure.',
    characteristics: ['Atmospheric', 'Minimal beats', 'Meditative', 'Textural'],
    originYear: '1970s',
    keyArtists: ['Brian Eno', 'Aphex Twin', 'Boards of Canada'],
    relatedGenres: ['downtempo', 'drone', 'chillout'],
    color: '#22d3ee',
    spotifyGenre: 'ambient',
  },
  
  // HIP HOP
  {
    id: 'hip-hop',
    name: 'Hip Hop',
    category: 'hip-hop',
    description: 'Cultural movement and music genre developed in the Bronx in the 1970s, featuring MCing, DJing, and sampling.',
    characteristics: ['Rapping', 'Sampling', 'Beats', 'Cultural'],
    originYear: '1970s',
    keyArtists: ['Run-DMC', 'Nas', 'Kendrick Lamar'],
    relatedGenres: ['trap', 'boom-bap', 'conscious-rap'],
    color: '#7c3aed',
    spotifyGenre: 'hip hop',
  },
  {
    id: 'trap',
    name: 'Trap',
    category: 'hip-hop',
    description: 'Hip hop subgenre that originated in the Southern United States, characterized by 808 kicks and hi-hats.',
    characteristics: ['808 drums', 'Hi-hats', 'Dark', 'Heavy bass'],
    originYear: '2000s',
    keyArtists: ['T.I.', 'Gucci Mane', 'Travis Scott'],
    relatedGenres: ['hip-hop', 'drill', 'mumble-rap'],
    color: '#8b5cf6',
    spotifyGenre: 'trap',
  },
  
  // JAZZ
  {
    id: 'jazz',
    name: 'Jazz',
    category: 'jazz',
    description: 'Music characterized by swing, blue notes, complex chords, and improvisation.',
    characteristics: ['Improvisation', 'Complex harmony', 'Swing', 'Blue notes'],
    originYear: '1920s',
    keyArtists: ['Miles Davis', 'John Coltrane', 'Duke Ellington'],
    relatedGenres: ['bebop', 'smooth-jazz', 'fusion'],
    color: '#ea580c',
    spotifyGenre: 'jazz',
  },
  {
    id: 'bebop',
    name: 'Bebop',
    category: 'jazz',
    description: 'Fast, complex jazz style developed in the 1940s with intricate melodies and rhythms.',
    characteristics: ['Fast tempo', 'Complex', 'Virtuosic', 'Improvisation'],
    originYear: '1940s',
    keyArtists: ['Charlie Parker', 'Dizzy Gillespie', 'Thelonious Monk'],
    relatedGenres: ['jazz', 'hard-bop', 'post-bop'],
    color: '#f59e0b',
    spotifyGenre: 'bebop',
  },
  
  // POP
  {
    id: 'pop',
    name: 'Pop',
    category: 'pop',
    description: 'Mainstream popular music aimed at a mass audience, characterized by short, catchy songs.',
    characteristics: ['Catchy melodies', 'Verse-chorus', 'Radio-friendly', 'Commercial'],
    originYear: '1950s',
    keyArtists: ['Michael Jackson', 'Madonna', 'Taylor Swift'],
    relatedGenres: ['synth-pop', 'electropop', 'indie-pop'],
    color: '#db2777',
    spotifyGenre: 'pop',
  },
  {
    id: 'synth-pop',
    name: 'Synth Pop',
    category: 'pop',
    description: 'Pop music featuring synthesizers as the dominant musical instrument.',
    characteristics: ['Synthesizers', '80s sound', 'Electronic', 'Melodic'],
    originYear: '1980s',
    keyArtists: ['Depeche Mode', 'Pet Shop Boys', 'The Weeknd'],
    relatedGenres: ['pop', 'new-wave', 'electropop'],
    color: '#ec4899',
    spotifyGenre: 'synth pop',
  },
  
  // INDIE
  {
    id: 'indie-rock',
    name: 'Indie Rock',
    category: 'indie',
    description: 'Independent rock music that exists outside of the mainstream commercial rock genre.',
    characteristics: ['Independent', 'Experimental', 'DIY', 'Alternative'],
    originYear: '1980s',
    keyArtists: ['The Strokes', 'Arctic Monkeys', 'Tame Impala'],
    relatedGenres: ['alternative', 'indie-pop', 'post-punk'],
    color: '#059669',
    spotifyGenre: 'indie rock',
  },
  {
    id: 'indie-pop',
    name: 'Indie Pop',
    category: 'indie',
    description: 'Melodic, guitar-based pop music with an independent ethos.',
    characteristics: ['Melodic', 'Jangly guitars', 'Lo-fi', 'Introspective'],
    originYear: '1980s',
    keyArtists: ['Vampire Weekend', 'Beach House', 'MGMT'],
    relatedGenres: ['indie-rock', 'dream-pop', 'chamber-pop'],
    color: '#10b981',
    spotifyGenre: 'indie pop',
  },
  
  // METAL
  {
    id: 'metal',
    name: 'Heavy Metal',
    category: 'metal',
    description: 'Loud, aggressive rock music with amplified distortion, extended guitar solos, and powerful vocals.',
    characteristics: ['Heavy riffs', 'Loud', 'Powerful', 'Technical'],
    originYear: '1970s',
    keyArtists: ['Black Sabbath', 'Iron Maiden', 'Metallica'],
    relatedGenres: ['thrash-metal', 'death-metal', 'doom-metal'],
    color: '#475569',
    spotifyGenre: 'metal',
  },
  
  // CLASSICAL
  {
    id: 'classical',
    name: 'Classical',
    category: 'classical',
    description: 'Western art music spanning from the 11th century to present, characterized by complex compositions.',
    characteristics: ['Orchestral', 'Complex', 'Formal', 'Historical'],
    originYear: '1600s',
    keyArtists: ['Bach', 'Mozart', 'Beethoven'],
    relatedGenres: ['baroque', 'romantic', 'contemporary-classical'],
    color: '#6366f1',
    spotifyGenre: 'classical',
  },
];

export const getGenreById = (id: string): Genre | undefined => {
  return genres.find(g => g.id === id);
};

export const getGenresByCategory = (category: string): Genre[] => {
  return genres.filter(g => g.category === category);
};

export const getRelatedGenres = (genreId: string): Genre[] => {
  const genre = getGenreById(genreId);
  if (!genre) return [];
  
  return genre.relatedGenres
    .map(id => getGenreById(id))
    .filter((g): g is Genre => g !== undefined);
};

export const categories = [
  { id: 'all', name: 'All Genres' },
  { id: 'rock', name: 'Rock' },
  { id: 'electronic', name: 'Electronic' },
  { id: 'hip-hop', name: 'Hip Hop' },
  { id: 'jazz', name: 'Jazz' },
  { id: 'pop', name: 'Pop' },
  { id: 'indie', name: 'Indie' },
  { id: 'metal', name: 'Metal' },
  { id: 'classical', name: 'Classical' },
];
