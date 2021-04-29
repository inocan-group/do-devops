import { IPackageJson } from "common-types";
import { DoDevopObservation } from "~/@types/observations";
import { fileExists } from "../file";
import {
  getPackageJson,
  hasDependency,
  hasDevDependency,
  hasMainExport,
  hasModuleExport,
  hasTypingsExport,
} from "../npm";
import { determineLinter } from "./index";

/**
 * Gets the core "observations" about the current directory.
 */
export function getObservations() {
  let observations: Set<DoDevopObservation> = new Set<DoDevopObservation>();
  let pkgJson: IPackageJson | undefined;
  try {
    pkgJson = getPackageJson();
  } catch {}

  if (pkgJson) {
    observations.add("packageJson");

    // TS
    if (hasDevDependency("typescript")) {
      observations.add("typescript");
    }
    if (hasDevDependency("ttypescript")) {
      observations.add("ttypescript");
    }
    if (hasDevDependency("typescript-transform-paths")) {
      observations.add("typescriptTransformPaths");
    }

    // Bundlers
    if (hasDevDependency("rollup")) {
      observations.add("rollup");
    }
    if (hasDevDependency("webpack")) {
      observations.add("webpack");
    }
    if (hasDevDependency("vite")) {
      observations.add("vite");
    }
    if (hasDevDependency("esbuild")) {
      observations.add("esbuild");
    }

    // DBs
    if (hasDependency("firebase-admin") || hasDependency("@firebase/app")) {
      observations.add("firebase");
    }
    if (hasDependency("firemodel")) {
      observations.add("firemodel");
    }
    if (hasDependency("universal-fire")) {
      observations.add("universalFire");
    }
    if (hasDependency("supabase")) {
      observations.add("supabase");
    }

    // Testing
    if (hasDevDependency("mocha")) {
      observations.add("mocha");
    }
    if (hasDevDependency("jest")) {
      observations.add("jest");
    }
    if (hasDevDependency("uvu")) {
      observations.add("uvu");
    }

    // Serverless
    if (hasDevDependency("serverless")) {
      observations.add("serverlessFramework");
    }
    if (fileExists("./serverless.yml")) {
      observations.add("serverlessYml");
    }
    if (fileExists("./serverless.ts")) {
      observations.add("serverlessTs");
    }
    if (hasDevDependency("webpack-plugin")) {
      observations.add("serverlessWebpackPlugin");
    }
    // https://www.serverless.com/plugins/serverless-sam
    if (hasDevDependency("serverless-sam")) {
      observations.add("serverlessSamPlugin");
    }

    // package manager
    if (fileExists("yarn.lock")) {
      observations.add("yarn");
    }
    if (fileExists("pnpm-lock.yaml")) {
      observations.add("pnpm");
    }
    if (fileExists("package-lock.json")) {
      observations.add("npm");
    }

    if (hasMainExport()) {
      observations.add("cjs");
    }
    if (hasModuleExport()) {
      observations.add("esm");
    }
    if (hasTypingsExport()) {
      observations.add("typings");
    }

    // linters
    const lint = determineLinter();
    observations = new Set<DoDevopObservation>([...observations, ...lint.observations]);
  }

  return observations;
}
