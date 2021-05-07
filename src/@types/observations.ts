export type BaseObservations =
  | "packageJson"
  | "typescript"
  | "ttypescript"
  | "tsNode"
  | "typescriptTransformPaths";

export type GitObservation = "gitignore" | "git-init";
export type BundlerObservation = "webpack" | "rollup" | "vite" | "esbuild" | "tsc" | "swc";
export type PackageManagerObservation = "yarn" | "npm" | "pnpm" | "packageManagerConflict";
export type TestObservation = "mocha" | "jest" | "uvu" | "ava" | "jasmine" | "qunit";
export type ExportObservation = "cjs" | "esm" | "typings";
export type LintObservation =
  | "eslint"
  | "tslint"
  | "prettier"
  | "eslintConfig"
  | "eslintPrettierPlugin"
  | "eslintIgnoreFile"
  | "typescriptEslintPlugin"
  | "typescriptEslintParser"
  | "tslintConfig";
export type ServerlessObservation =
  | "serverlessFramework"
  | "awsOrchestrate"
  | "awsCredentials"
  | "serverlessTs"
  | "serverlessWebpackPlugin"
  | "serverlessSamPlugin"
  | "samCli"
  | "serverlessYml";
export type FrameworkObservation = "vue" | "react";
export type DbObservation =
  | "firemodel"
  | "universalFire"
  | "firebase"
  | "supabase"
  | "sqlite"
  | "dynamodb";

export type MonorepoObservation = "rushjs" | "lerna" | "yarnWorkspaces";

export type DoDevopObservation =
  | BaseObservations
  | GitObservation
  | BundlerObservation
  | ExportObservation
  | LintObservation
  | PackageManagerObservation
  | TestObservation
  | DbObservation
  | FrameworkObservation
  | ServerlessObservation;

/**
 * A _set_ of observations made about the `do-devops` runtime environment
 */
export type Observations<T extends string = DoDevopObservation> = Set<T>;
