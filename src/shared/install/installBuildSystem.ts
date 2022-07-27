import chalk from "chalk";
import { Options, Observations } from "~/@types";
import { DevopsError } from "~/errors";
import { installEsLint } from "~/shared/install";
import { saveProjectConfig } from "~/shared/config";
import { getPackageJson, installDevDep, savePackageJson } from "~/shared/npm";
import { askConfirmQuestion, askListQuestion } from "~/shared/interactive";
import { removeTslint } from "~/shared/remove";
import { logger } from "~/shared/core";
import { templateDirCopy, templateFileCopy } from "../file";
import { getObservations } from "../observations";

export async function installBuildSystem(opts: Options, observations: Observations) {
  const log = logger(opts);

  const confirm = await askConfirmQuestion(
    chalk`You do not currently have a {blue build} {italic system} defined. Would you like to have one setup?`
  );
  if (!confirm) {
    return false;
  }

  if (observations.has("tslint")) {
    await removeTslint(opts, observations);
  }

  if (!observations.has("eslint")) {
    const installed = await installEsLint(opts, observations);
    if (!installed) {
      return false;
    }
    observations = getObservations();
  }

  let pkg = getPackageJson();
  const scripts = pkg.scripts ? pkg.scripts : {};
  if (!scripts.lint) {
    scripts.lint = `run-s lint:src lint:test lint:tsc`;
    scripts["lint:src"] = observations.has("eslint") ? "eslint src/**/*.ts" : "";
    scripts["lint:test"] = observations.has("eslint") ? "eslint src/**/*.ts" : "";
    scripts["lint:tsc"] = "npx tsc --noEmit";
  }

  const bundler = await askListQuestion(
    chalk`Which transpiler/bundler will you use in this repo?`,
    ["tsc", "rollup", "webpack", "vite", "esbuild", "swc"] as const
  );
  await saveProjectConfig({ general: { bundler } });

  let devDeps: string[] = [];

  switch (bundler) {
    case "tsc":
      devDeps = [];
      scripts.build = `run-s clean lint build:bundle`;
      scripts["build:bundle"] = `ttsc -P tsconfig.build.json`;
      scripts.watch = scripts.watch ? scripts.watch : `ttsc -P tsconfig.build.json -w`;
      break;
    case "rollup":
      devDeps = [
        "rollup",
        "@ampproject/rollup-plugin-closure-compiler",
        "@rollup/plugin-commonjs @rollup/plugin-json",
        "@rollup/plugin-node-resolve",
        "rollup-plugin-analyzer",
        "rollup-plugin-terser",
        "rollup-plugin-typescript2",
      ];
      scripts.build = `npx node devops/build commonjs esnext --closure`;
      scripts["build:analyze"] = scripts["build:analyze"]
        ? scripts["build:analyze"]
        : `npx node devops/build esnext --analyze --closure`;
      scripts.watch = scripts.watch ? scripts.watch : `ttsc -P tsconfig.build.json -w`;

      // TODO: conditional to choose between single and multi-entry
      await templateFileCopy("bundlers/rollup/build.single-entry.js", "/devops/build.js");

      break;
    case "webpack":
      devDeps = ["webpack"];
      break;
    case "esbuild":
      devDeps = ["esbuild"];
      break;
    case "swc":
      devDeps = ["@swc/core", "@swc/cli"];
      break;
    case "vite":
      devDeps = ["vite", "vite-plugin-md", "vite-plugin-components", "vite-ssg", "vite-plugin-pwa"];
      break;
  }
  // https://swc.rs/

  await templateDirCopy("typescript", "/");
  log.whisper(chalk`{gray - {blue tsconfig} files transferred}`);

  const installed = await installDevDep(
    opts,
    observations,
    ...devDeps,
    "typescript",
    "ttypescript",
    "typescript-transform-paths",
    "npm-run-all",
    "ts-node",
    "rimraf"
  );
  if (!installed) {
    throw new DevopsError(`Problem installing dev dependencies for "tsc" build/bundle solution`);
  }
  log.whisper(chalk`{gray - dev dependencies for {blue ${bundler}} are installed}`);
  pkg = getPackageJson(undefined, true);
  pkg.scripts = scripts;
  await savePackageJson(pkg);

  return true;
}
