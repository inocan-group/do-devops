import { getLambdaFunctions } from "../../../private";

/**
 * Introspects your current configuration (ts config) and finds all
 * references to AWS Layers
 */
export function findLayersReferencedByFns() {
  const fns = getLambdaFunctions();
}
