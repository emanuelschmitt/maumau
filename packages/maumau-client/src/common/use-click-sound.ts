import useSound from 'use-sound';

function useClickSound() {
  return useSound('/static/audio/click.wav', { volume: 0.7 });
}

export default useClickSound;
