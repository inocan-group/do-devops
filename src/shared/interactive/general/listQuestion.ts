import { Answers, DistinctChoice, ListChoiceMap, ListQuestion } from "inquirer";
import { IInteractiveOptions } from "~/@types/interactive-types";

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
 * Note: if you want to ask the question immediately, use
 * `listQuestionNow()` instead.
 */
export function listQuestion<T extends DistinctChoice<ListChoiceMap<Answers>>[]>(
  name: string,
  question: string,
  choices: T,
  options: IInteractiveOptions<T> = {}
): ListQuestion {
  const response: ListQuestion = {
    type: "list" as const,
    name,
    message: question,
    choices,
    default: options.default,
    ...(options.when ? { when: options.when } : { when: () => true }),
  };

  return response;
}
