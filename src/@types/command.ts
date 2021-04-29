/* eslint-disable no-use-before-define */

import { IDictionary, isNonNullObject } from "common-types";
import { IGlobalOptions } from "~/shared/core";
import { ICommandDescription } from "./general";
import { DoDevopObservation } from "./observations";
import { IOptionDefinition } from "./option-types";

/**
 * The set of registered commands recognized by `do-devops`
 */
export type KnownCommand<E extends string = never> =
  | "autoindex"
  | "awsid"
  | "bitbucket"
  | "build"
  | "deploy"
  | "endpoints"
  | "fns"
  | "info"
  | "invoke"
  | "latest"
  | "layers"
  | "pkg"
  | "ssm"
  | "test"
  | "validate"
  | "install"
  | "update"
  | "upgrade"
  | "outdated"
  | "watch"
  | "why"
  | E;

/**
 * When a command is kicked off by `do-devops` it is provided the following
 * inputs to its task.
 */
export interface ICommandInput<T extends object = {}> {
  /**
   * If the command declares _sub-commands_ then the first element from the CLI
   * will be pulled off and added as the `subCommand` (note: the user may have put
   * nothing in here and command's are responsible for addressing that possibility)
   */
  subCommand?: string;
  /**
   * By default just an empty array but if the commands declares itself "greedy"
   * it will be filled with all initial string based arguments to the CLI
   */
  argv: string[];
  /**
   * Provides the unparsed array of tokens that the CLI received (minus the "command")
   */
  raw: string[];
  /**
   * All command line options defined locally by the command and/or globally defined
   * options.
   */
  opts: Partial<T> & IGlobalOptions;
  /**
   * An array of observations about the environment that the user is running the
   * command in.
   */
  observations: Set<DoDevopObservation>;
  unknown: string[];
}

/**
 * **IDoDevopsHandler**
 *
 * Every recognized **command** in `do-devops` must provide an
 * ansynchronous _handler_ function that matches this format.
 */
export type DoDevopsHandler<T extends object = {}> = (input: ICommandInput<T>) => Promise<any>;

/**
 * This two property descriptor allows a command to have a succinct description displayed
 * when looking at the the global help (which lists all commands) but then a longer, more
 * complete description when looking at help for just that command.
 */
export type ICommandDescriptor = { short: string; complete: string };

/**
 * Type guard which tests whether the input is a `ICommandDescriptor` dictionary
 */
export function isCommandDescriptor(desc: unknown): desc is ICommandDescriptor {
  return isNonNullObject(desc) &&
    (desc as ICommandDescriptor).short &&
    (desc as ICommandDescriptor).complete
    ? true
    : false;
}

/**
 * A callback signature used for meta-properties of a **command** in `do-devops`.
 *
 * > _this allows "observations" to be passed into the command to help it adjust it's
 * > output_
 */
export type DynamicCommandDefinition<T> = (
  observations: Set<DoDevopObservation>,
  options?: IDictionary
) => T;

/**
 * **isDynamicCommandDefinition**
 *
 * Tests whether one of the command's meta properties is defined by a
 * `DynamicCommandDefinition` and needs to be _run_ before resolving to
 * it's final value.
 */
export function isDynamicCommandDefinition<T extends unknown | DynamicCommandDefinition<unknown>>(
  defn: T
): defn is Extract<T, Function> {
  return typeof defn === "function";
}

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
  syntax?: string;
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
  description: string | ICommandDescriptor | DynamicCommandDefinition<string | ICommandDescriptor>;
  /**
   * The sub-commands which a given commands offers
   */
  subCommands?: ICommandDescription[] | DynamicCommandDefinition<ICommandDescription[]>;
  /**
   * If a command states that it's _greedy_ then an `argv` string array will be passed into
   * the handler (by default it is passed an empty array).
   *
   * > Note: there is an important interaction between subCommands and this option as they both
   * are wanting to pull params as the `defaultOption`. All you need to know, however, is that
   * if you turn on greedy _and_ you have sub-commands then the `subCommand` will be pulled off
   * first and the remaining will be sent to `argv`
   */
  greedy?: boolean;
  options?: IOptionDefinition;
  examples?: string[];
  /**
   * If turned on that this command will not show up in the command
   * list unless the user explicitly requests it with `dd --showHidden`
   */
  hiddenCommand?: boolean;
}

export type Finalized<T extends IDoDevopsCommand> = Omit<
  T,
  "syntax" | "description" | "subCommand"
> & {
  syntax: string;
  description: string;
  subCommands: ICommandDescription[] | undefined;
};

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
