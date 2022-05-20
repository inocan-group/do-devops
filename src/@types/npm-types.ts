import { Iso8601DateTime } from "common-types";

export interface INpmInfoTable {
  repo: string;
  latest: string;
  exports: string;
  description: string;
}

export interface INpmDep {
  name: string;
  version: string;
}

export interface INpmDependencies {
  total: number;
  hasDependencies: boolean;
  dependencies: INpmDep[];
  hasDevDependencies: boolean;
  devDependencies: INpmDep[];
  hasOptionalDependencies: boolean;
  optionalDependencies: INpmDep[];
  hasPeerDependencies: boolean;
  peerDependencies: INpmDep[];
}

/**
 * Timing of tagged release provided by the
 * `timingFromNpmInfo` utility function
 */
export interface INpmTiming {
  created: Iso8601DateTime;
  modified: Iso8601DateTime;
  first: { tag: string; timestamp: Iso8601DateTime };
  last: { tag: string; timestamp: Iso8601DateTime };
}

export type INpmDepProperty =
  | "dependencies"
  | "devDependencies"
  | "peerDependencies"
  | "optionalDependencies";
