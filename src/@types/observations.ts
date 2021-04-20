export type PackageManagerObservation = "yarn" | "npm" | "pnpm";
export type TestObservation = "mocha" | "yarn";
export type ServerlessObservation = "serverless-framework" | "aws-credentials";
export type FrameworkObservation = "vue" | "react";
export type DbObservation =
  | "firemodel"
  | "universal-fire"
  | "firebase"
  | "supabase"
  | "sqlite"
  | "dynamodb";

export type DoDevopObservation =
  | PackageManagerObservation
  | TestObservation
  | DbObservation
  | FrameworkObservation
  | ServerlessObservation;
