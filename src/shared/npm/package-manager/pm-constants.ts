import { PackageManagerObservation } from "~/@types";

export const PACKAGE_MANAGERS: Exclude<PackageManagerObservation, "packageManagerConflict">[] = [
  "npm",
  "pnpm",
  "yarn",
];

export const PKG_MGR_LOCK_FILE_LOOKUP: Record<
  Exclude<PackageManagerObservation, "packageManagerConflict">,
  string
> = {
  npm: "package-lock.json",
  pnpm: "pnpm-lock.yaml",
  yarn: "yarn.lock",
};
