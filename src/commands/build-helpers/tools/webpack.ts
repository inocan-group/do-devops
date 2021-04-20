import wp from "webpack";
import path from "path";
import { IDictionary } from "common-types";

import { IBuildToolingOptions } from "./types";
import { getValidServerlessHandlers } from "~/shared/ast";

function build(fns: string[], _opts: IDictionary) {
  return async function webpackBuild() {
    console.log("webpack build:", fns);
  };
}

function watch(_fns: string[], _opts: IDictionary) {
  return async function webpackWatch() {
    const wpConfig = await import(path.join(process.cwd(), "webpack.config.js"));
    wp(wpConfig).watch({}, function () {
      console.log("watcher");
    });
  };
}

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
