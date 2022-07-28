import { Options, Observations } from "src/@types";
import { removeDep } from "src/shared/npm";

export async function removeTslint(opts: Options, observations: Observations) {
  await removeDep(opts, observations, "tslint");
}
