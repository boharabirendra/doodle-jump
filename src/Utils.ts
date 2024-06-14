export function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export interface IPoint {
  posX: number;
  posY: number;
}

export enum DIRECTION {
  UP,
  DOWN,
  RIGHT,
  LEFT,
}

/* Audio player   */
export function playSound(sound: HTMLAudioElement) {
  sound.currentTime = 0;
  sound.play();
}
