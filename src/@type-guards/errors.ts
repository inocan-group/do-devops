import { DevopsError } from "~/errors";

export function isDevopsError(err: unknown): err is DevopsError {
  return typeof err === "object" && (err as any).kind === "DevopsError";
}

export function isClassification(
  error: unknown,
  classification: `${string}/${string}`
): error is DevopsError {
  return isDevopsError(error) && error.classification === classification;
}
