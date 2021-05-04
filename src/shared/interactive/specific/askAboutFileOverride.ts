import chalk from "chalk";
import { exec } from "shelljs";
import { DoDevopObservation, Observations } from "~/@types";
import { getUserConfig } from "~/shared/config";
import { logger } from "~/shared/core";
import { getFileComponents, libraryDirectory, diffFiles } from "~/shared/file";
import { askListQuestion, askUserAboutEditorCommand } from "~/shared/interactive";
import { emoji } from "~/shared/ui";

export type FileAction = "show" | "diff" | "skip" | "copy";

const answers = [
  { name: "Show both files in editor", value: "show" },
  { name: "Show differences between files in editor", value: "diff" },
  { name: "Skip this file being from being copied", value: "skip" },
  { name: "Copy the template file over repo's version", value: "copy" },
];

/**
 * If a file is being copied to a target location where the file already exists,
 * this interactive session will allow users to view the files and the _diff_ between
 * the files but ultimately they must decide between "copy" and "skip" which is translated
 * into a boolean flag where "copy" is true.
 */
export async function askAboutFileOverwrite(
  source: string,
  target: string,
  opts: Observations = new Set<DoDevopObservation>()
) {
  const parts = getFileComponents(source, libraryDirectory("templates"));
  const filename = chalk`{dim ${parts.filepath}}{bold /${parts.filename}}`;
  const log = logger(opts);
  log.shout(chalk`The file {blue ${filename}} already exists.`);
  let action: FileAction | undefined;
  while (action !== "copy" && action !== "skip") {
    action = await askListQuestion<FileAction>("What do you want to do?", answers);
    if (action === "show") {
      let editorCommand = getUserConfig().general?.editorCommand;
      if (!editorCommand) {
        editorCommand = await askUserAboutEditorCommand();
        if (editorCommand) {
          log.info(
            chalk`- the editor command "${editorCommand}" has been saved to your user configuration.`
          );
          log.info(chalk`{gray - the user config file is located at {blue ~/.do-devops.json}}`);
        }
      }
      if (editorCommand) {
        const open = exec(`${editorCommand} ${source} ${target} &`);
        if (open.code === 0) {
          log.info(chalk`- check your editor for the two versions of the file`);
        } else {
          log.info(chalk`- ${emoji.poop} there was a problem openning the files in your editor`);
        }
      }
    }
    if (action === "diff") {
      diffFiles(source, target);
    }
  }

  return action === "copy" ? true : false;
}
