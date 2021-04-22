import { OptionDefinition } from "command-line-usage";
import { IDictionary } from "common-types";
import { ICommandDescription } from "./general";
import { DoDevopObservation } from "./observations";

/**
 * The set of registered commands recognized by `do-devops`
 */
export type KnownCommand<E extends string = never> =
  | "autoindex"
  | "awsid"
  | "bitbucket"
  | "build"
  | "deploy"
  | "latest"
  | "layers"
  | "ssm"
  | "validate"
  | "install"
  | "update"
  | "upgrade"
  | "outdated"
  | E;

/**
 * **IDoDevopsHandler**
 *
 * Every recognized **command** in `do-devops` must provide an
 * ansynchronous _handler_ function that matches this format.
 */
export type DoDevopsHandler = (argv: string[], opts: IDictionary) => Promise<void>;

/**
 * Defines a function callback mechanism intended for defining a
 * command's meta information my dynamically to the environment
 * in which is being executed.
 */
export type DynamicCommandDefinition<T> = (observations: DoDevopObservation[]) => T;

/**
 * **IDoDevopsCommand**
 *
 * Every command must export the following symbols. This will be picked
 * up by the `getCommmands()` function where the structure will
 * tested as an interface definition.
 */
export interface IDoDevopsCommand {
  /** a unique type alias assigned to each command */
  kind: KnownCommand;
  /**
   * The handler function which handles the command's execution
   */
  handler: DoDevopsHandler;
  /**
   * A description of the command.
   *
   * Return types can be a string or a tuple of two strings. The Tuple is used
   * where you want to provide a short description for the general help page,
   * but a longer help text for when people ask for help on the actual command.
   *
   * In both cases, you can statically return the string or be passed an array
   * of _observations_ to adjust the text.
   */
  description: string | DynamicCommandDefinition<string>;
  commands?: ICommandDescription[];
  options?: OptionDefinition[];
  examples?: string[];
  /**
   * If turned on that this command will not show up in the command
   * list unless the user explicitly requests it with `dd --showHidden`
   */
  hiddenCommand?: boolean;

  excludeOptions?: DynamicCommandDefinition<string> | string[];
}

/**
 * a type guard which detects a valid shape for the `do-devops` command definition
 */
export function isDoDevopsCommand(cmd: unknown): cmd is IDoDevopsCommand {
  return (
    typeof cmd === "object" &&
    typeof (cmd as IDictionary).handler === "function" &&
    typeof (cmd as IDictionary).kind === "string" &&
    (cmd as IDictionary).description !== undefined
  );
}
