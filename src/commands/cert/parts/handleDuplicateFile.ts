import { currentDirectory, fileExists } from "src/shared/file";
import { askListQuestion } from "src/shared/interactive/general/askListQuestion";
import { askInputQuestion } from "src/shared/interactive";
import { exit } from "node:process";

/**
 * Returns immediately if the file _does not_ exist, otherwise asks user for
 * their desired handling.
 */
export async function handleDuplicateFile(file: string): Promise<string | false> {
  const filepath = currentDirectory(file);

  if (!fileExists(filepath)) {
    return filepath;
  }

  const answer = await askListQuestion(
    `The file "${file}" exists already; choose how to handle this:`,
    {
      keep: "keep existing file and move on",
      overwrite: "overwrite existing",
      rename: "change the cert's name to something else",
      quit: "quit creation of the cert",
    }
  );

  switch (answer) {
    case "keep":
      return false;
    case "quit":
      console.log();
      exit(0);
    case "overwrite":
      return file;
    case "rename":
      const filename = await askInputQuestion(`What filename should we use?`);
      return handleDuplicateFile(filename);
  }
}
