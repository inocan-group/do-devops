import { IDoConfig } from "../commands/defaults";
/**
 * The base class for commands which have a configuration
 * component. This class defines the contract for creating
 * default values as well as providing some helper methods
 * for subclasses to leverage.
 */
export declare abstract class BaseDefault<T> {
    /** the _command_ which this class is responsible for */
    abstract readonly command: keyof IDoConfig;
    /**
     * returns a dictionary of default values for the _config_ of a given command
     */
    abstract defaultValues(): T;
    /**
     * Asks the user for the correct values. The _default value_ will be selected by
     * default but user can decide to move away from that.
     */
    abstract askForValues(): Promise<T>;
    /**
     * **findMissingConfigProperties**
     *
     * Validates that the configuration information from the file has all the properties that are
     * defined as defaultValues. The result is a list of properties which have a _default value_
     * but are missing from the current config file. This
     *
     * @param currentConfig the configuration for the specific command (from the config file)
     */
    findMissingConfig(): Promise<(keyof T)[]>;
    /**
     * **fixMissingConfig**
     *
     * Finds and _adds_ all properties that are **not** in the current configuration file
     */
    fixMissingConfig(): Promise<void>;
}
