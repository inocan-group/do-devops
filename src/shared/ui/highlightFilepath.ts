/* eslint-disable unicorn/import-style */
import chalk, { Modifiers, ForegroundColor } from "chalk";

export type ModifiedForegroundColor = [typeof Modifiers | undefined, typeof ForegroundColor];
export type ForegroundColor = typeof ForegroundColor;

/**
 * Uses `chalk` to present a nicely formatted
 * filepath and file where the file name itself is highlighted
 */
export function highlightFilepath(
  fp: string,
  color: ModifiedForegroundColor | ForegroundColor = ["dim", "blueBright"],
  highlight: ModifiedForegroundColor | ForegroundColor = ["bold", "blueBright"]
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
    ? chalk`{${modifier} {${foreground} ${path + "/"}}}`
    : chalk`{${foreground} ${path + "/"}}`;

  const fileName = highModifier
    ? chalk`{${highModifier} {${highForeground} ${file}}}`
    : chalk`{${highForeground} ${file}}`;

  return `${filePath}${fileName}`;
}
