import * as wp from "webpack";

import { getValidServerlessHandlers, validateWebpackConfig } from "../../../shared/ast/index";

import { IBuildToolingOptions } from "./types";
import { IDictionary } from "common-types";
import { join } from "path";

/**
 * Transpiles all or _some_ of the handler functions
 * using **Webpack**
 */
export default function webpack(opts: IBuildToolingOptions = {}) {
  const fns = opts.fns || getValidServerlessHandlers();
  delete opts.fns;

  return {
    build: build(fns, opts),
    watch: watch(fns, opts),
  };
}

function build(fns: string[], opts: IDictionary) {
  return async function webpackBuild() {
    console.log("webpack build:", fns);
  };
}

function watch(fns: string[], opts: IDictionary) {
  return async function webpackWatch() {
    const wpConfig = await import(join(process.cwd(), "webpack.config.js"));
    wp(wpConfig).watch({}, function () {
      console.log("watcher");
    });
  };
}
