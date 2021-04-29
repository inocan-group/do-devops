import { DevopsError } from "./DevopsError";

export function isDevopsError(error: unknown): error is DevopsError {
  return error instanceof Error && (error as DevopsError).kind === "DevopsError";
}
