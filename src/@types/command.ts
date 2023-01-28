/* eslint-disable no-use-before-define */

import { IDictionary, isNonNullObject } from "common-types";
import { Keys, Narrowable } from "inferred-types";
import { Observations } from ".";
import { ICommandDescription } from "./general";
import { GlobalOptions } from "./global";
import { DoDevopObservation } from "./observations";
import {  OptionDefn } from "./option-types";
import commands from "src/commands";
import { ILogger } from "src/shared/core";

export type KnownCommand = Keys<typeof commands>;
export type CommandDefinitions = typeof commands;

/**
 * An interactive configurator for given command.
 */
export type CommandConfigurator = <
  TCmd extends string
>(cmd: TCmd) => <TOpt extends GlobalOptions<any>>(options: TOpt, obs: Observations) => void;

/**
 * When a command is kicked off by `do-devops` it is provided the following
 * inputs to its task.
 */
export interface CommandInput<
  TCmd extends KnownCommand,
  TOpt extends OptionDefn<N>,
  N extends Narrowable
> {
  command: TCmd;
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
   * All values for the CLI options/flags; this includes both global and locally 
   * defined properties.
   */
  opts: TOpt;

  /**
   * An array of observations about the environment that the user is running the
   * command in.
   */
  observations: Set<DoDevopObservation>;
  /**
   * any unknown parsed values from CLI
   */
  unknown: string[];

  /**
   * Logging interface pre-configured with input from the CLI options
   */
  log: ILogger;
}

/**
 * **DoDevopsHandler**
 *
 * Every recognized **command** in `do-devops` must provide an
 * asynchronous **handler function** that matches this format.
 */
export type DoDevopsHandler<
  T extends OptionDefn
> = (input: CommandInput<T>) => Promise<any>;

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
 * **Command**`<TCmd,TOpt,THidden>`
 *
 * The properties required to define a command in `do-devops`
 */
export interface Command<
  TCmd extends string = string,
  TOpt extends OptionDefn<any> = {},
  THidden extends boolean = false
> {
  /** a unique type alias assigned to each command */
  kind: TCmd;
  /**
   * The handler function which handles the command's execution
   */
  handler: DoDevopsHandler<TOpt>;
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
  options: TOpt;
  /**
   * Examples can be provided and will be displayed in help system
   */
  examples?: string[];
  /**
   * If turned on that this command will not show up in the command
   * list unless the user explicitly requests it with `dd --showHidden`
   */
  hiddenCommand?: THidden;

  /**
   * Allows a command to interactively be configured.
   */
  config?: <T extends GlobalOptions<any>, O extends Observations>(
    opts: T,
    observations: O
  ) => Promise<void>;
}

export type Finalized<T extends Command> = Omit<
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
export function isCommand<
  TCmd extends string,
  TOpt extends OptionDefn
>(cmd: unknown): cmd is Command<TCmd,TOpt> {
  return (
    typeof cmd === "object" &&
    typeof (cmd as IDictionary).handler === "function" &&
    typeof (cmd as IDictionary).kind === "string" &&
    (cmd as IDictionary).description !== undefined
  );
}
