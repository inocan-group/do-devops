import { Answers, Question } from "inquirer";

/**
 * All interactive options should provide these optional parameters.
 *
 */
export interface IInteractiveOptions<T extends Answers = Answers> {
  when?: (...args: any[]) => boolean;
  default?: Question<T>["default"];
}
