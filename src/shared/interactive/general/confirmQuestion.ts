import { ConfirmQuestion } from "inquirer";

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
export const confirmQuestion = (name: string, question: string): ConfirmQuestion => {
  return {
    type: "confirm",
    name,
    message: question,
  };
};
