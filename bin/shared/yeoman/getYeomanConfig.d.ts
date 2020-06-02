/**
 * returns the `.yo-rc.json` file combined with the
 * `.yo-transient.json` should they exist.
 *
 * Will always return a dictionary of some sort (even
 * if it's an empty dictionary)
 */
export declare function getYeomanConfig(scaffold?: string): {
    [x: string]: any;
};
