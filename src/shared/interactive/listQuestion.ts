import { ListQuestion } from "inquirer";
import { Omit } from "common-types";

export function listQuestion(q: Omit<ListQuestion, "type">) {
  return {
    ...q,
    type: "list",
  };
}
