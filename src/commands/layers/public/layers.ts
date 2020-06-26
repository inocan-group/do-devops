import { findLayersReferencedByFns, getLayersWithMeta } from "../../../shared";

import { IDictionary } from "common-types";

/** handler for the "layers" command */
export async function handler(args: string[], opts: IDictionary) {
  const layers = findLayersReferencedByFns();
  const layersWithMeta = getLayersWithMeta();
  console.log(JSON.stringify({ layers, layersWithMeta }, null, 2));
}
