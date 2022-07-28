import { ConfirmQuestion } from "inquirer";
import { ConfirmationChoice, IInteractiveOptions } from "src/@types/interactive-types";

/**
 * Builds a composable boolean/confirm based question. For example:
 *
 * ```ts
 * const questions = {
 *    ...confirmQuestion('continue', 'are you sure?');
 * }
 * ```
 *
 * **Note:** use this function when you're composing several questions
 * together and are intending to just define the question with the _ask_
 * coming later. If you want to just immediately ask the question then
 * use the `confirmQuestionNow()` instead.
 */
export const confirmQuestion = <T extends ConfirmationChoice>(
  name: string,
  question: string,
  options: IInteractiveOptions<T> = { choices: { true: "Y", false: "N" } } as IInteractiveOptions<T>
): ConfirmQuestion<T> => {
  const defaultValues = {
    when: options.when || (() => true),
    default: options.default || true,
  };

  return {
    name,
    type: "confirm" as const,
    message: question,
    ...defaultValues,
  };
};
