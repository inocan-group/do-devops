import chalk, { Chalk } from "chalk";

/**
 * Uses the `chalk` utility to present a nicely formatted
 * filepath and file where the file name itself is highlighted
 */
export function highlightFilepath(
  fp: string,
  color: string[] = ["dim", "blue"],
  highlight: string[] = ["bold", "blue"]
) {
  let parts = fp.split(/[\/\\]/);
  const file = parts.pop();
  const path = parts.join("/").replace(/^(\S)/, "./$1");

  const baseFormat: Chalk = color.reduce(
    (acc, curr) => acc[curr as keyof typeof chalk] as Chalk,
    chalk
  );
  const highlightFormat: Chalk = highlight.reduce(
    (acc, curr) => acc[curr as keyof typeof chalk] as Chalk,
    chalk
  );

  return `${baseFormat(path + "/")}${highlightFormat(file)}`;
}
