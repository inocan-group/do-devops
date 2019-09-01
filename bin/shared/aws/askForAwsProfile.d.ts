export interface IAskForProfileOptions {
    /**
     * optionally state a particular profile name to be the default; if not stated
     * or not found then the first profile in the `credentials` file will be used.
     */
    defaultProfile?: string;
    /**
     * by default it will return an error to the caller but if you prefer it can
     * simply exit the process with an error message to the console.
     */
    exitOnError?: boolean;
}
/**
 * Asks the user to choose an AWS profile
 */
export declare function askForAwsProfile(opts?: IAskForProfileOptions): Promise<string>;
