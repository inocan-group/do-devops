import { IBuildToolingOptions } from "./types";
/**
 * Transpiles all or _some_ of the handler functions
 * using **Webpack**
 */
export default function webpack(opts?: IBuildToolingOptions): {
    build: () => Promise<void>;
    watch: () => Promise<void>;
};
