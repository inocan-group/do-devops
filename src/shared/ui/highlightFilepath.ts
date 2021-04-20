/* eslint-disable unicorn/import-style */
import chalk, { Modifiers, ForegroundColor } from "chalk";

export type ModifiedForegroundColor = [
  typeof Modifiers | undefined,
  typeof ForegroundColor
];
export type ForegroundColor = typeof ForegroundColor;

/**
 * Uses `chalk` to present a nicely formatted
 * filepath and file where the file name itself is highlighted
 */
export function highlightFilepath(
  fp: string,
  color: ModifiedForegroundColor | ForegroundColor = ["dim", "blue"],
  highlight: ModifiedForegroundColor | ForegroundColor = ["bold", "blue"]
) {
  if (!Array.isArray(color)) {
    color = [undefined, color];
  }
  if (!Array.isArray(highlight)) {
    highlight = [undefined, highlight];
  }

  const [modifier, foreground] = color;
  const [highModifier, highForeground] = color;

  const parts = fp.split(/[/\\]/);
  const file = parts.pop();
  const path = parts.join("/").replace(/^(\S)/, "./$1");

  const baseFormat = modifier
    ? `{${modifier} {${foreground} ${path + "/"}}}`
    : `{${foreground} ${path + "/"}}`;

  const highlightFormat = highModifier
    ? `{${highModifier} {${highForeground} ${file}}}`
    : `{${highForeground} ${file}}`;

  return chalk`${baseFormat}${highlightFormat}`;
}
