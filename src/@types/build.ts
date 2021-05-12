import { IServerlessFunctionHandler, IServerlessYaml } from "common-types";

/**
 * Provides a file and `ref` object which contains the handler function
 * and it's configuration.
 */
export interface IHandlerReference {
  file: string;
  ref: {
    handler: () => void;
    config?: Omit<IServerlessYaml, "handler">;
  };
}

/**
 * The configuration which the AST process was able to
 * discover for a function along with the _interface_ being
 * used.
 */
export type IDiscoveredConfig = {
  interface: string;
  config: IServerlessFunctionHandler;
};
