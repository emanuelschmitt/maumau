import useSound from 'use-sound';

import { AUDIO_VOLUME } from './constants';

function useSuitSelectSound() {
  return useSound('/static/audio/suit-select.wav', { volume: AUDIO_VOLUME });
}

export default useSuitSelectSound;
