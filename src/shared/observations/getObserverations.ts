import { IPackageJson } from "common-types";
import { existsSync } from "node:fs";
import { DoDevopObservation } from "~/@types/observations";
import { IMAGE_CACHE } from "~/constants";
import { getProjectConfig } from "../config";
import { currentDirectory, dirExists, fileExists, repoDirectory } from "../file";
import { TS_IMAGE_SUPPORT_FILE } from "../images/useImageApi/createTsSupportFile";
import {
  getPackageJson,
  hasDependency,
  hasDevDependency,
  hasMainExport,
  hasModuleExport,
  hasTypingsExport,
  PKG_MGR_LOCK_FILE_LOOKUP,
} from "../npm";
import { determineLinter } from "./index";

/**
 * Gets the core "observations" about the current directory.
 */
export function getObservations() {
  let observations: Set<DoDevopObservation> = new Set<DoDevopObservation>();
  const projectConfig = getProjectConfig();
  let pkgJson: IPackageJson | undefined;
  try {
    pkgJson = getPackageJson();
  } catch {}

  if(existsSync(currentDirectory("Cargo.toml"))) {
    observations.add("cargo");
  }

  if (pkgJson) {
    observations.add("packageJson");

    // Git
    if (fileExists(currentDirectory(".gitignore"))) {
      observations.add("gitignore");
    }
    if (dirExists(currentDirectory(".git"))) {
      observations.add("git-init");
    }
    if (hasDevDependency("typescript")) {
      // TS
      observations.add("typescript");
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
    if (hasDevDependency("vue")) {
      observations.add("vue");
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

    // needed for serverless devops handoffs
    if (hasDevDependency("ts-node")) {
      observations.add("tsNode");
    }

    // Image Command
    if (fileExists(IMAGE_CACHE)) {
      observations.add("image-cache");
    }
    if (fileExists(TS_IMAGE_SUPPORT_FILE)) {
      observations.add("image-ts-support");
    }
    if (projectConfig.image && projectConfig.image.rules.length > 0) {
      observations.add("image-rules-defined");
    }

    // package manager & monorepo
    let pm = 0;
    if (fileExists(PKG_MGR_LOCK_FILE_LOOKUP.yarn)) {
      pm++;
      observations.add("yarn");
    }
    if (fileExists(PKG_MGR_LOCK_FILE_LOOKUP.pnpm)) {
      pm++;
      observations.add("pnpm");
      if (fileExists("pnpm-workspace.yaml")) {
        observations.add("monorepo");
        observations.add("pnpmWorkspaces");
      }
    }
    if (fileExists(PKG_MGR_LOCK_FILE_LOOKUP.npm)) {
      pm++;
      observations.add("npm");
    }
    if (pm > 1) {
      observations.add("packageManagerConflict");
    }
    if (hasDevDependency("lerna")) {
      observations.add("lerna");
      observations.add("monorepo");
    }

    // npm
    if (pkgJson.private === true) {
      observations.add("private");
    }
    if (pkgJson.private === false) {
      observations.add("public");
    }

    // monorepo

    if (!observations.has("git-init")) {
      // if a repo is not in GIT yet this is an signal that
      // repo may very well just be a package in a monorepo
      try {
        const parent = getPackageJson(repoDirectory());
        if (parent?.private === true) {
          observations.add("parent-private");
        } else {
          observations.add("parent-public");
        }
        if (fileExists(repoDirectory("pnpm-workspace.yaml"))) {
          observations.add("pnpmWorkspaces");
        }
      } catch {
        observations.add("no-parent-repo");
      }
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
