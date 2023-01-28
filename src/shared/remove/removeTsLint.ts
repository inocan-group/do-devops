import { GlobalOptions, Observations } from "src/@types";
import { removeDep } from "src/shared/npm";

export async function removeTslint(opts: GlobalOptions, observations: Observations) {
  await removeDep(opts, observations, "tslint");
}
