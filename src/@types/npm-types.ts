export interface INpmInfoTable {
  repo: string;
  latest: string;
  exports: string;
  urls: string;
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

export type INpmDepProperty =
  | "dependencies"
  | "devDependencies"
  | "peerDependencies"
  | "optionalDependencies";
