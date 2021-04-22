import { IAwsLayerMeta, IDictionary } from "common-types";

import { getPackageJson } from "../..";
import path from "path";

export type ILayerMetaLookups = IDictionary<IAwsLayerMeta>;

/**
 * Introspects your dev dependencies for those which have `aws-layer`
 * or `aws-layer-meta` indicated as a **keyword**. From that it
 * constructs the meta information defined in `IAwsLayerMeta`.
 *
 * Note: this is a quick lookup method but will miss layers which were
 * not tagged appropriately in `package.json`.
 */
export function getLayersFromPackageJson(): IAwsLayerMeta[] {
  const devDeps = Object.keys(getPackageJson().devDependencies || {});
  // get deps with appropriate tagging
  const pkgJsonFiles = devDeps.filter((d) => {
    const keywords = getPackageJson(path.join(process.cwd(), "node_modules", d)).keywords;
    return keywords
      ? keywords.includes("aws-layer-meta") || keywords.includes("aws-layer")
      : false;
  });

  return pkgJsonFiles
    .filter((i) => i)
    .reduce((agg, d) => {
      const meta = require(path.join(process.cwd(), "node_modules", d))
        .meta as IAwsLayerMeta;
      const info: IAwsLayerMeta = meta
        ? { ...meta, name: meta.name }
        : { name: d, namespace: "unknown", versions: [] };

      agg.push(info);
      return agg;
    }, [] as IAwsLayerMeta[]);
}
