import chalk from "chalk";
import { join, relative } from "node:path";
import { ensureDirectory, getSubdirectories, repoDirectory } from "src/shared/file";
import { askListQuestion } from ".";

export interface INestedDirOptions {
  /** the starting directory; if left off then repo directory will be chosen */
  startDir?: string;
  /** filter possible file names */
  filter?: (v: string) => boolean;

  /** rather than just offering ALL subdirs we can start with only a suitable set */
  initialChoices?: string[];

  /**
   * similar to `initialChoices` option but rather than only show the initial choices
   * passed in, the _leadChoices_ are placed at top of the list followed by all
   * choices which pass the filter expression.
   */
  leadChoices?: string[];

  /**
   * by default this dialog finishs with the text "Selected Directory:" and then the
   * directory name but you can replace this generic text with whatever name you prefer
   */
  name?: string;
}

export async function askForNestedDirectory(ask: string, options: INestedDirOptions = {}) {
  let operatingDir = options.startDir ? options.startDir : repoDirectory();

  const dirs: string[] = [];
  let choice: string = "";
  const filter = options.filter || (() => true);
  const COMPLETED = "COMPLETED";

  while (choice !== COMPLETED) {
    const subDirs =
      dirs.length === 0 && options.initialChoices
        ? options.initialChoices
        : dirs.length === 0 && options.leadChoices
        ? [...new Set([...options.leadChoices, ...getSubdirectories(operatingDir).filter(filter)])]
        : getSubdirectories(operatingDir).filter(filter);

    if (subDirs.length === 0) {
      choice === COMPLETED;
      break;
    } else {
      choice =
        dirs.length === 0
          ? await askListQuestion(ask, [...subDirs, COMPLETED])
          : await askListQuestion(
              chalk`Thanks. The selected path so far is: {blue ${dirs.join(
                "/"
              )}}\nNow choose either a subdirectory or "COMPLETED" to finish the selection.`,
              [COMPLETED, ...subDirs]
            );
      if (choice !== COMPLETED) {
        dirs.push(choice);
        operatingDir = join(operatingDir, `${choice}/`);

        const created = await ensureDirectory(operatingDir);
        if (created) {
          console.log(
            chalk`{dim - the {bold ${choice}} directory {italic didn't exist} so we've created it for you.}`
          );
          choice = COMPLETED;
        }
      }
    }
  } // end while loop

  const relativeDirectory = relative(repoDirectory(), operatingDir);
  console.log(chalk`{bold {yellow ${options.name || "Selected Directory"}:} ${relativeDirectory}}`);

  return relativeDirectory;
}
