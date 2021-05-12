import { Answers, Question } from "inquirer";

/**
 * All interactive options should provide these optional parameters.
 *
 */
export interface IInteractiveOptions<T extends Answers = Answers> {
  when?: (...args: any[]) => boolean;
  default?: Question<T>["default"];
}

/**
 * When asking questions with discrete choices you can provide a simple
 * array of values but if you want to be more descriptive you can use
 * this interface to define the choice.
 */
export interface IChoice<T extends string | number | object> {
  name: string;
  value: T;
  short?: string;
}

export type Choices<T extends string | number | object> = T[] | Array<{ name: string; value: T }>;
