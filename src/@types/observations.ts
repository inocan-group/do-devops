export type BaseObservations =
  | "packageJson"
  | "typescript"
  | "ttypescript"
  | "tsNode"
  | "typescriptTransformPaths";

export type GitObservation = "gitignore" | "git-init" | "git-parent-init";
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

export type MonorepoObservation =
  | "rushjs"
  | "lerna"
  | "yarnWorkspaces"
  | "monorepo-package"
  | "pnpmWorkspaces"
  | "pnpm-monorepo"
  | "no-parent-repo"
  | "monorepo";
export type NpmObservation = "private" | "public" | "parent-private" | "parent-public";

export type ImageObservations = "image-cache" | "image-ts-support" | "image-rules-defined";

export type DoDevopObservation =
  | BaseObservations
  | GitObservation
  | BundlerObservation
  | ExportObservation
  | LintObservation
  | PackageManagerObservation
  | TestObservation
  | DbObservation
  | MonorepoObservation
  | NpmObservation
  | ImageObservations
  | FrameworkObservation
  | ServerlessObservation;

/**
 * A _set_ of observations made about the `do-devops` runtime environment
 */
export type Observations<T extends string = DoDevopObservation> = Set<T>;
