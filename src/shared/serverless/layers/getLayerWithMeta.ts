import { IAwsLayerMeta, IDictionary } from "common-types";

import { getPackageJson } from "../..";
import { join } from "path";

export interface ILayerMetaLookups {
  byName: IDictionary<IAwsLayerMeta>;
  byArn: IDictionary<IAwsLayerMeta>;
}

/**
 * Introspects your dev dependencies for those which have `aws-layer-meta`
 * indicated as a **keyword** and then returns two dictionaries: `byMeta`
 * and `byArn` which serve as handy lookup services.
 */
export function getLayerMeta(): ILayerMetaLookups {
  const devDeps = Object.keys(getPackageJson().devDependencies);
  const pkgJsonFiles = devDeps.filter((d) => {
    const keywords = getPackageJson(join(process.cwd(), "node_modules", d)).keywords;
    return keywords.includes("aws-layer-meta");
  });
  const byName = pkgJsonFiles.reduce((agg: IDictionary, d) => {
    const meta = require(join(process.cwd(), "node_modules", d)).meta;
    if (meta) {
      agg[meta.name] = meta as IAwsLayerMeta;
    }
    return agg;
  }, {});
  const byArn = pkgJsonFiles.reduce((agg: IDictionary, d) => {
    const meta = require(join(process.cwd(), "node_modules", d)).meta;
    if (meta && meta.arn) {
      agg[meta.arn] = meta as IAwsLayerMeta;
    }
    return agg;
  }, {});

  return { byName, byArn };
}
