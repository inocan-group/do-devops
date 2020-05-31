import { InputQuestion } from "inquirer";
import { Omit } from "common-types";

export function inputQuestion(q: Omit<InputQuestion, "type">) {
  return {
    ...q,
    type: "input",
  };
}
