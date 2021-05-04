import { IInteractiveOptions } from "~/@types";
import { ask } from "./ask";

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
  options: IInteractiveOptions<any> = {}
): Promise<string> {
  const q = {
    type: "input",
    name: "inputValue",
    message: question,
    default: options.default,
    ...(options.when ? { when: options.when } : { when: () => true }),
  };
  const answer = await ask(q);

  return answer.inputValue as string;
}
