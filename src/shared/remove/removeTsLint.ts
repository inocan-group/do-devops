import { Options, Observations } from "~/@types";
import { removeDep } from "~/shared/npm";

export async function removeTslint(opts: Options, observations: Observations) {
  await removeDep(opts, observations, "tslint");
}
