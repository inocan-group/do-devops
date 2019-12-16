import "./play-sound";
import playSound from "play-sound";

export enum SoundEffect {
  glass = "glass",
  laser = "laser",
  sadTrombone = "sadTrombone",
  scream = "scream"
}

export type ISoundEffect = keyof typeof SoundEffect;

/**
 * Plays sounds effects but is dependant on a OS level player.
 * For **MacOS** the `afplay` is the default. For other OS's it
 * is `aplay` but if you're on Linux it may be better to use
 * `mpg123` or `mpg321`.
 */
export async function play(effect: ISoundEffect = "glass") {
  const player = playSound();
  player.play(`./src/shared/sound/${effect}.m4a`);
}
