import { IDictionary } from "common-types";
import { ICommandDescription } from "./general";

/**
 * The set of registered commands recognized by `do-devops`
 */
export type KnownCommands<E extends string = never> =
  | "autoindex"
  | "awsid"
  | "bitbucket"
  | "build"
  | "deploy"
  | "latest"
  | "layers"
  | "ssm"
  | "validate"
  | E;

/**
 * **IDoDevopsHandler**
 *
 * Every recognized **command** in `do-devops` must provide an
 * ansynchronous _handler_ function that matches this format.
 */
export type IDoDevopsHandler = (argv: string[], opts: IDictionary) => Promise<void>;

/**
 * Defines a function callback mechanism intended for defining a
 * command's meta information my dynamically to the environment
 * in which is being executed.
 */
export type DynamicCommandDefinition<T> = (...opts: any[]) => T;

/**
 * **IDoDevopsCommand**
 *
 * Every command must export the following symbols. This will be picked
 * up by the `getCommmands()` function where the structure will
 * tested as an interface definition.
 */
export interface IDoDevopsCommand {
  // TODO: make this required once ready to have stronger typing
  kind?: KnownCommands;
  handler: IDoDevopsHandler;
  description: string | DynamicCommandDefinition<string>;
  commands?: ICommandDescription[];
  examples?: string[];
}

/**
 * a type guard which detects a valid `do-devops` command definition
 */
export function isDoDevopsCommand(cmd: unknown): cmd is IDoDevopsCommand {
  return (
    typeof cmd === "string" &&
    typeof ((cmd as unknown) as IDictionary).handler === "function"
  );
}
