import { 
  DynamicCommandDefinition, 
  ICommandDescriptor, 
  OptionDefn,
  CommandConfigurator, 
  DoDevopsHandler, 
  Command 
} from "src/@types";

export interface CommandOptions<
  TOptions extends OptionDefn<any>,
  TConfig extends ReturnType<CommandConfigurator>
> {
  /**
   * CLI options which this command exposes beyond the _global_ options
   */
  options?: TOptions;
  /** if you want to express the command's syntax in a bespoke way you can */
  syntax?: string;
  /**
   * if this command has an interactive configurator then it can be added here
   * ```ts
   * const config: CommandConfigurator = (options, observations) => void
   * ```
   */
  config?: TConfig;
}

/**
 * The default configurator. This will simply tell the caller that interactive
 * configuration for the given command has not yet been implemented.
 */
const defaultConfig: CommandConfigurator = (cmd) => () => {
  console.log(`- the interactive configurator for "${cmd} has not been built yet`);
  console.log();
  
  return;
};

/**
 * **createCommand**(name, handler, desc, options)
 * 
 * A builder which helps to provide a strongly typed command.
 */
export const createCommand = <
  TCmd extends string,
  TCliOptions extends OptionDefn<any>,
  TConfig extends ReturnType<CommandConfigurator>
>(
  /** the _name_ of the command */
  name: TCmd,
  /** the handler function */
  handler: DoDevopsHandler<TCliOptions>, 
  /** 
   * a descriptive string, an object with short and long desc, or a callback
   * function which returns `string | ICommandDescriptor`.
   */
  description: string 
    | ICommandDescriptor 
    | DynamicCommandDefinition<string | ICommandDescriptor>,
  /**
   * You can set optional properties associated with a command such as:
   * 
   * - **CLI Options** - add additional CLI flags
   * - **Interactive Config** - provide an interactive script to configure this function
   */
  options: CommandOptions<TCliOptions, TConfig>
) => {
  return {
    kind: name,
    handler,
    description,
    options: options.options || {} as TCliOptions,
    config: options.config ?? defaultConfig(name)
  } as unknown as Command<TCmd, TCliOptions, false>;
};
