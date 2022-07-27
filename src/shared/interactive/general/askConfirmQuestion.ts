import { Answers, Question } from "inquirer";
import { ConfirmationChoice, IInteractiveOptions } from "~/@types";
import { ask } from "./ask";
import { confirmQuestion } from "./confirmQuestion";

/**
 * **confirmQuestionNow**
 *
 * Asks the user a yes/no question. For example:
 *
 * ```ts
 * const continue = await confirmQuestionNow('Shall we continue?');
 * ```
 *
 * **Note:** use this function when you want to ask a question right away.
 * If you want to compose functions into an array of questions and then ask,
 * use `confirmQuestion()` instead.
 */
export const askConfirmQuestion = async <T extends ConfirmationChoice & Answers>(
  question: string,
  options: IInteractiveOptions<T> = { choices: { true: "Y", false: "N" } } as IInteractiveOptions<T>
): Promise<boolean> => {
  const q = confirmQuestion<T>("confirmQuestion", question, options) as Question<Answers>;

  const answer = await ask(q);
  return answer.yesOrNo;
};
