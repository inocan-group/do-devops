import { IAwsLayerMeta, IDictionary } from "common-types";
export interface ILayerMetaLookups {
    byName: IDictionary<IAwsLayerMeta>;
    byArn: IDictionary<IAwsLayerMeta>;
}
/**
 * Introspects your dev dependencies for those which have `aws-layer-meta`
 * indicated as a **keyword** and then returns two dictionaries: `byMeta`
 * and `byArn` which serve as handy lookup services.
 */
export declare function getLayersWithMeta(): ILayerMetaLookups;
