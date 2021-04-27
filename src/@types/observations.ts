export type BaseObservations =
  | "packageJson"
  | "typescript"
  | "ttypescript"
  | "typescriptTransformPaths";
export type BundlerObservation = "webpack" | "rollup" | "vite" | "esbuild";
export type PackageManagerObservation = "yarn" | "npm" | "pnpm";
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
  | BundlerObservation
  | ExportObservation
  | LintObservation
  | PackageManagerObservation
  | TestObservation
  | DbObservation
  | FrameworkObservation
  | ServerlessObservation;
