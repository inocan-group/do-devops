export interface IDoPackageConfig {
    preDeployHooks?: string[];
    /**
     * In many/most cases we are wrapping commands provided by
     * different libraries. Should these underlying commands be
     * displayed as part of the CLI output?
     */
    showUnderlyingCommands: boolean;
}
export declare function deploy(): IDoPackageConfig;
