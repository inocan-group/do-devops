import { DevopsError } from "./DevopsError";
import { isDevopsError } from "./isDevopsError";

export function isClassification(
  error: unknown,
  classification: `${string}/${string}`
): error is DevopsError {
  return isDevopsError(error) && error.classification === classification;
}
