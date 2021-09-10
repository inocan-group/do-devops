import { Answers } from "inquirer";
import { IInteractiveOptions } from "~/@types";
import { ask } from "./ask";

export type InputQuestionOptions<T extends Answers = Answers> = IInteractiveOptions<T> & {
  acceptEmptyResponse?: boolean;
};

/**
 * **askListQuestion**
 *
 * Utility function to ask an "input" based question to a
 * user immediately:
 *
 * ```ts
 * const answer = askInputQuestion<T>(
 *    "Tell me about yourself"
 * );
 * ```
 *
 * Alternatively, if you pass an array of _hashes_ where the hash
 * can have `name`, `value` and `disabled` properties.
 */
export async function askInputQuestion(
  question: string,
  options: InputQuestionOptions = {}
): Promise<string> {
  const q = {
    type: "input",
    name: "inputValue",
    message: question,
    default: options.default,
    ...(options.when ? { when: options.when } : { when: () => true }),
  };
  const answer = await ask(q);
  if (answer.inputValue === "" && options.acceptEmptyResponse === false) {
    console.log("This question requires a non-empty response!");
    return askInputQuestion(question, options);
  }

  return answer.inputValue as string;
}
