"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayersWithMeta = void 0;
const __1 = require("../..");
const path_1 = require("path");
/**
 * Introspects your dev dependencies for those which have `aws-layer-meta`
 * indicated as a **keyword** and then returns two dictionaries: `byMeta`
 * and `byArn` which serve as handy lookup services.
 */
function getLayersWithMeta() {
    const devDeps = Object.keys(__1.getPackageJson().devDependencies);
    const pkgJsonFiles = devDeps.filter((d) => {
        const keywords = __1.getPackageJson(path_1.join(process.cwd(), "node_modules", d)).keywords;
        return keywords ? keywords.includes("aws-layer-meta") : false;
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
exports.getLayersWithMeta = getLayersWithMeta;
