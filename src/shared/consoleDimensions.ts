import { asyncExec } from "async-shelljs";

/**
 * gets back the `height` and `width` of the current
 * console
 */
export async function consoleDimensions() {
  let [width, height] = (await asyncExec(`echo $(tput cols),$(tput lines)`, {
    silent: true
  }))
    .split(",")
    .map(i => Number(i));

  width = process.stdout.columns || width;
  height = process.stdout.rows || height;

  return { height, width };
}
