import type { AudioFeatures, Mood } from '../types';

export interface MoodFilters {
  min_energy?: number;
  max_energy?: number;
  min_danceability?: number;
  max_danceability?: number;
  min_tempo?: number;
  max_tempo?: number;
  min_valence?: number;
  max_valence?: number;
  target_energy?: number;
  target_danceability?: number;
  target_tempo?: number;
  target_valence?: number;
}

export const MOOD_FILTERS: Record<Mood, MoodFilters> = {
  study: {
    min_energy: 0.0,
    max_energy: 0.5,
    min_valence: 0.3,
    max_valence: 0.7,
  },
  workout: {
    min_energy: 0.7,
    max_energy: 1.0,
    min_danceability: 0.6,
    min_tempo: 120,
    target_energy: 0.9,
  },
  relax: {
    min_energy: 0.0,
    max_energy: 0.4,
    min_valence: 0.3,
    max_valence: 0.8,
    target_energy: 0.2,
  },
  party: {
    min_energy: 0.7,
    max_energy: 1.0,
    min_danceability: 0.7,
    min_tempo: 110,
    min_valence: 0.6,
    target_danceability: 0.85,
  },
  focus: {
    min_energy: 0.2,
    max_energy: 0.6,
    min_valence: 0.4,
    max_valence: 0.7,
  },
  sleep: {
    min_energy: 0.0,
    max_energy: 0.3,
    min_tempo: 40,
    max_tempo: 80,
    target_energy: 0.1,
  },
  happy: {
    min_valence: 0.7,
    max_valence: 1.0,
    min_energy: 0.5,
    target_valence: 0.9,
  },
  sad: {
    min_valence: 0.0,
    max_valence: 0.4,
    min_energy: 0.2,
    max_energy: 0.6,
    target_valence: 0.2,
  },
  energetic: {
    min_energy: 0.7,
    max_energy: 1.0,
    min_tempo: 120,
    target_energy: 0.9,
  },
  calm: {
    min_energy: 0.0,
    max_energy: 0.4,
    min_tempo: 60,
    max_tempo: 100,
    target_energy: 0.2,
  },
};

export const MOOD_LABELS: Record<Mood, string> = {
  study: 'Study',
  workout: 'Workout',
  relax: 'Relax',
  party: 'Party',
  focus: 'Focus',
  sleep: 'Sleep',
  happy: 'Happy',
  sad: 'Sad',
  energetic: 'Energetic',
  calm: 'Calm',
};

export const MOOD_DESCRIPTIONS: Record<Mood, string> = {
  study: 'Music perfect for studying and concentration',
  workout: 'High-energy tracks for workouts and exercise',
  relax: 'Calming music to help you unwind',
  party: 'Danceable tracks perfect for parties',
  focus: 'Music to help you focus and be productive',
  sleep: 'Gentle, slow music for falling asleep',
  happy: 'Upbeat, positive music to lift your mood',
  sad: 'Emotional music for reflection',
  energetic: 'High-energy music to boost your energy',
  calm: 'Peaceful, tranquil music',
};

export function getMoodFromFeatures(features: AudioFeatures): Mood[] {
  const moods: Mood[] = [];

  if (features.energy < 0.3 && features.tempo < 80) {
    moods.push('sleep', 'calm');
  } else if (features.energy > 0.7 && features.danceability > 0.7) {
    moods.push('party', 'workout', 'energetic');
  } else if (features.valence > 0.7) {
    moods.push('happy');
  } else if (features.valence < 0.4) {
    moods.push('sad');
  }

  if (features.instrumentalness > 0.7 && features.energy < 0.5) {
    moods.push('study', 'focus');
  }

  if (features.energy < 0.4 && features.valence > 0.4 && features.valence < 0.7) {
    moods.push('relax', 'calm');
  }

  return moods.length > 0 ? moods : ['calm'];
}

