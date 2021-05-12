import { IGlobalOptions, Observations } from "~/@types";
import { removeDep } from "~/shared/npm";

export async function removeTslint(opts: IGlobalOptions, observations: Observations) {
  await removeDep(opts, observations, "tslint");
}
