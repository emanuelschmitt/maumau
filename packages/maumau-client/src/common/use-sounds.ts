import useSound from 'use-sound';

import { AUDIO_VOLUME } from './constants';

const sounds = {
  bubble: {
    path: '/static/audio/bubble.ogg',
  },
} as const;

type SoundName = keyof typeof sounds;

type Options = {
  volume?: number;
  playbackRate?: number;
};

function useSounds(name: SoundName, options: Options = {}) {
  const sound = sounds[name];
  return useSound(sound.path, { volume: AUDIO_VOLUME, ...options });
}

export default useSounds;
