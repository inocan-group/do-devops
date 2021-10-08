import { ConfirmQuestion } from "inquirer";
import { wordWrap } from "~/shared/ui";
import { ask } from "./ask";

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
export const askConfirmQuestion = async (
  question: string,
  defaultAnswer: boolean = true
): Promise<boolean> => {
  const q: ConfirmQuestion = {
    type: "confirm",
    name: "yesOrNo",
    message: wordWrap(question),
    default: defaultAnswer,
  };
  const answer = await ask(q);
  return answer.yesOrNo;
};
