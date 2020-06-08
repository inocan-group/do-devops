/**
 * Returns a boolean flag to indicate whether the `package.json`
 * is claiming this package to be a **ES** module or just plain
 * old **CJS** module.
 *
 * This is determined via the `type` property
 * and your mileage with this may vary depending on your module
 * building strategy and what stage of the build process your
 * looking to test for.
 */
export declare function exportsAsEsm(): boolean;
