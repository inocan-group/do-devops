import { Keys } from "inferred-types";

export type ConfirmationChoice = {
  true: string;
  false: string;
};

export type Choices = readonly string[] | readonly number[] | Record<string, string>;

/**
 * All interactive options should provide these optional parameters.

 */
export interface IInteractiveOptions<
  T extends Choices | ConfirmationChoice,
  /** when set to true, default value should be an array */
  A extends boolean = false
> {
  when?: (...args: any[]) => boolean;
  default?: A extends true ? Keys<T>[] : T extends ConfirmationChoice ? boolean : Keys<T>;
  choices?: T extends ConfirmationChoice ? ConfirmationChoice : never;
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
