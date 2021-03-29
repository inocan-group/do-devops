import { IServerlessConfig } from "common-types";

/**
 * Provides a file and `ref` object which contains the handler function
 * and it's configuration.
 */
export interface IHandlerReference {
  file: string;
  ref: {
    handler: () => void;
    config?: Omit<IServerlessConfig, "handler">;
  };
}
