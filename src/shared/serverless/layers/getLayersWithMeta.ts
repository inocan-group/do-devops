import { IAwsLayerMeta, IDictionary } from "common-types";

import { getPackageJson } from "src/shared/npm";
import path from "node:path";
import { DevopsError } from "src/errors";

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
  const pkg = getPackageJson();
  if (!pkg) {
    throw new DevopsError(
      `Attempt to read layers from package.json but file is missing!`,
      "not-ready/missing-package-json"
    );
  }
  const devDeps = Object.keys(pkg.devDependencies || {});
  // get deps with appropriate tagging
  const pkgJsonFiles = devDeps.filter((d) => {
    const foreignPkg = getPackageJson(path.join(process.cwd(), "node_modules", d));
    if (!foreignPkg) {
      throw new DevopsError(
        `Attempt to get info on package info on "" requires that it be installed in the repo. Make sure to install deps before running this command.`,
        "not-ready/missing-dep"
      );
    }
    const keywords = foreignPkg.keywords;
    return keywords ? keywords.includes("aws-layer-meta") || keywords.includes("aws-layer") : false;
  });

  return pkgJsonFiles
    .filter(Boolean)
    .reduce((agg, d) => {
      const meta = require(path.join(process.cwd(), "node_modules", d)).meta as IAwsLayerMeta;
      const info: IAwsLayerMeta = meta
        ? { ...meta, name: meta.name }
        : { name: d, namespace: "unknown", versions: [] };

      agg.push(info);
      return agg;
    }, [] as IAwsLayerMeta[]);
}
