import { ConfirmQuestion } from "inquirer";
import { Omit } from "common-types";

export function confirmQuestion(q: Omit<ConfirmQuestion, "type">) {
  return {
    ...q,
    type: "confirm",
  };
}
