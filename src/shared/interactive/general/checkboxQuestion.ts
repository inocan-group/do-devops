import { CheckboxQuestion } from "inquirer";
import { Omit } from "common-types";

export function checkboxQuestion(q: Omit<CheckboxQuestion, "type">) {
  return {
    ...q,
    type: "checkbox",
  };
}
