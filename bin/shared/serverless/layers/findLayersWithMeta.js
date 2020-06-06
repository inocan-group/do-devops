"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayerMeta = void 0;
const shared_1 = require("../../../shared");
const path_1 = require("path");
/**
 * Introspects your dev dependencies for those which have `aws-layer-meta`
 * indicated as a **keyword** and then returns two dictionaries: `byMeta`
 * and `byArn` which serve as handy lookup services.
 */
function getLayerMeta() {
    const devDeps = Object.keys(shared_1.getPackageJson().devDependencies);
    const pkgJsonFiles = devDeps.filter((d) => {
        const keywords = shared_1.getPackageJson(path_1.join(process.cwd(), "node_modules", d)).keywords;
        return keywords.includes("aws-layer-meta");
    });
    const byName = pkgJsonFiles.reduce((agg, d) => {
        const meta = require(path_1.join(process.cwd(), "node_modules", d)).meta;
        if (meta) {
            agg[meta.name] = meta;
        }
        return agg;
    }, {});
    const byArn = pkgJsonFiles.reduce((agg, d) => {
        const meta = require(path_1.join(process.cwd(), "node_modules", d)).meta;
        if (meta && meta.arn) {
            agg[meta.arn] = meta;
        }
        return agg;
    }, {});
    return { byName, byArn };
}
exports.getLayerMeta = getLayerMeta;
