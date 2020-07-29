import useSound from 'use-sound';

import { AUDIO_VOLUME } from './constants';

function useClickSound() {
  return useSound('/static/audio/click.wav', { volume: AUDIO_VOLUME });
}

export default useClickSound;
