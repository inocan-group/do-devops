import { DoDevopObservation } from "~/@types/observations";
import { fileExists } from "../file";
import { getPackageJson, hasDependency, hasDevDependency } from "../npm";
import { determineLinter } from "./index";

/**
 * Gets the core "observations" about the current directory.
 */
export function getObservations() {
  let observations: DoDevopObservation[] = [];
  const pkgJson = getPackageJson();

  if (pkgJson) {
    observations.push("packageJson");

    // TS
    if (hasDevDependency("typescript")) {
      observations.push("typescript");
    }
    if (hasDevDependency("ttypescript")) {
      observations.push("ttypescript");
    }
    if (hasDevDependency("typescript-transform-paths")) {
      observations.push("typescriptTransformPaths");
    }

    // Bundlers
    if (hasDevDependency("rollup")) {
      observations.push("rollup");
    }
    if (hasDevDependency("webpack")) {
      observations.push("webpack");
    }
    if (hasDevDependency("vite")) {
      observations.push("vite");
    }
    if (hasDevDependency("esbuild")) {
      observations.push("esbuild");
    }

    // DBs
    if (hasDependency("firebase-admin") || hasDependency("@firebase/app")) {
      observations.push("firebase");
    }
    if (hasDependency("firemodel")) {
      observations.push("firemodel");
    }
    if (hasDependency("universal-fire")) {
      observations.push("universalFire");
    }
    if (hasDependency("supabase")) {
      observations.push("supabase");
    }

    // Testing
    if (hasDevDependency("mocha")) {
      observations.push("mocha");
    }
    if (hasDevDependency("jest")) {
      observations.push("jest");
    }
    if (hasDevDependency("uvu")) {
      observations.push("uvu");
    }

    // Serverless
    if (hasDevDependency("serverless")) {
      observations.push("serverlessFramework");
    }
    if (hasDevDependency("webpack-plugin")) {
      observations.push("serverlessWebpackPlugin");
    }
    // https://www.serverless.com/plugins/serverless-sam
    if (hasDevDependency("serverless-sam")) {
      observations.push("serverlessSamPlugin");
    }

    // package manager
    if (fileExists("yarn.lock")) {
      observations.push("yarn");
    }
    if (fileExists("pnpm-lock.yaml")) {
      observations.push("pnpm");
    }
    if (fileExists("package-lock.json")) {
      observations.push("npm");
    }

    // linters
    const lint = determineLinter();
    observations = [...observations, ...lint.observations];
  }

  return observations;
}
