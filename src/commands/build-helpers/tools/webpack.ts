import {
  getValidServerlessHandlers,
  validateWebpackConfig
} from "../../../shared/ast/index";
import wp from "webpack";
import { IDictionary } from "common-types";
import { IBuildToolingOptions } from "./types";

/**
 * Transpiles all or _some_ of the handler functions
 * using **Webpack**
 */
export default function webpack(opts: IBuildToolingOptions = {}) {
  const fns = opts.fns || getValidServerlessHandlers();
  delete opts.fns;

  return {
    build: build(fns, opts),
    watch: watch(fns, opts)
  };
}

function build(fns: string[], opts: IDictionary) {
  return function webpackBuild() {
    console.log("webpack build:", fns);
  };
}

function watch(fns: string[], opts: IDictionary) {
  return function webpackWatch() {
    //
  };
}
