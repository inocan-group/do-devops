import {
  Answers,
  AsyncDynamicQuestionProperty,
  DistinctChoice,
  ListChoiceMap,
  ListQuestion,
} from "inquirer";
import { IChoice, IInteractiveOptions } from "~/@types/interactive-types";

/**
 * **listQuestion**
 *
 * Utility function to add a list based question to a
 * composed set of questions.
 *
 * ```ts
 * const survey = {
 *  ...listQuestion(
 *    "myQuestion",
 *    "What is your fav color?",
 *    ["red", "blue", "green"]
 *  );
 * };
 * ```
 *
 * Note: choices can be an array of values or an array of `IChoice` which
 * requires the `name` and `value` and allows a `short` property as well.
 */
export function listQuestion<T extends string | number | object>(
  name: string,
  question: string,
  choices: ListQuestion<T[]>["choices"],
  options: IInteractiveOptions<T[]> = {}
): ListQuestion<T[]> {
  const response: ListQuestion<T[]> = {
    type: "list" as const,
    name,
    message: question,
    choices,
    default: options.default,
    ...(options.when ? { when: options.when } : { when: () => true }),
  };

  return response;
}
