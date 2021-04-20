import { IDictionary } from "common-types";
import { findLayersReferencedByFns, getLayersWithMeta } from "~/shared";

/** handler for the "layers" command */
export async function handler(_args: string[], _opts: IDictionary) {
  const layers = findLayersReferencedByFns();
  const layersWithMeta = getLayersWithMeta();
  console.log(JSON.stringify({ layers, layersWithMeta }, null, 2));
}
