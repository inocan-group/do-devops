/* eslint-disable unicorn/import-style */
import chalk from "chalk";
import type { ForegroundColorName, BackgroundColorName } from "chalk";

/**
 * Uses `` to present a nicely formatted
 * filepath and file where the file name itself is highlighted
 */
export function highlightFilepath(
  fp: string,
  color: [ForegroundColorName | undefined, BackgroundColorName | undefined] = ["blue", undefined],
  highlight: [ForegroundColorName | undefined, BackgroundColorName | undefined] = [
    "blueBright",
    undefined,
  ]
) {
  if (!Array.isArray(color)) {
    color = [undefined, color];
  }
  if (!Array.isArray(highlight)) {
    highlight = [undefined, highlight];
  }

  const [modifier, foreground] = color;
  const [highModifier, highForeground] = highlight;

  const parts = fp.split(/[/\\]/);
  const file = parts.pop();
  const path = parts.join("/").replace(/^(\S)/, "./$1");

  const filePath = modifier
    ? chalk[modifier]`{${foreground} ${path + "/"}}`
    : `{${foreground} ${path + "/"}}`;

  const fileName = highModifier
    ? chalk[highModifier]`{${highForeground} ${file}}`
    : highForeground 
      ? chalk[highForeground]`${file}}`
      : `${file}}`;

  return `${filePath}${fileName}`;
}
