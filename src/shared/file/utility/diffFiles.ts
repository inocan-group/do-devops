import chalk from "chalk";
import diff from "diff";
import { readFile } from "../crud/readFile";

export function diffFiles(file1: string, file2: string) {
  const content1 = readFile(file1);
  const content2 = readFile(file2);
  if (content1 && content2) {
    const differences = diff.diffChars(content1, content2);
    for (const block of differences) {
      const color = block.added ? chalk.green : block.removed ? chalk.red : chalk.gray;
      process.stdout.write(color(block.value));
    }
  }
  console.log();
}
