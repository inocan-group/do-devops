import { saveUserConfig } from "~/shared/config";
import { askListQuestion } from "~/shared/interactive";
import { askInputQuestion } from "../general/askInputQuestion";

/**
 * Asks the user for a command to run to open files in the
 * user's editor of choice.
 *
 * The setting will be saved in the user config file and
 * returned to the caller.
 */
export async function askUserAboutEditorCommand() {
  let editor: string = await askListQuestion("What editor command should we use to open files?", {
    code: "vs-code (using 'code' to open)",
    vim: "vim",
    subl: "Sublime Text (using 'subl' to open)",
    other: "other",
  });
  if (editor === "other") {
    editor = await askInputQuestion("what is the command for this editor?");
  }
  if (editor) {
    saveUserConfig({ general: { editorCommand: editor } });
  }

  return editor;
}
