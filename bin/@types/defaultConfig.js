"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildTool = void 0;
var BuildTool;
(function (BuildTool) {
    BuildTool["typescript"] = "typescript";
    BuildTool["webpack"] = "webpack";
    BuildTool["rollup"] = "rollup";
    BuildTool["bili"] = "bili";
    /** just runs `yarn run build` */
    BuildTool["yarn"] = "typescript";
    /** just runs `npm run build` */
    BuildTool["npm"] = "webpack";
    /**
     * some other build process that is not understood; this will throw an error
     * if a build is run.
     */
    BuildTool["other"] = "rollup";
    /**
     * There is **no** build step for this repo.
     *
     * Note: this is quite common with Serverless projects which just use the
     * build process to rebuild the `serverless.yml` file.
     */
    BuildTool["none"] = "bili";
})(BuildTool = exports.BuildTool || (exports.BuildTool = {}));
