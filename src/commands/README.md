# Commands

By adding a file that exports a `handler` function along a `description` then it will be made active in **do-devops**.

## Command Exports

1. **`handler`** - the handler is the function which provides the commands functionality and takes the signature of:

    ```typescript
    export async function handler(argv: string[], opts: IDictionary): Promise<void> {...}
    ```

2. **`description`** - to be active a command must also have a description, this can be exported as a _string_ or a _function_. In the case of a function, the function will be passed `argv` and `opts` to that it may respond to this information.
3. **`examples`** - to add more information to the help system it is often a good idea to provide examples. This will be displayed along with other _meta_ when the user types: `do <command> --help`
4. **`options`** - a command is allowed to add any additional options they need to fill out their functionality. This is done by exporting either an array format or a function which returns an array. This array is typed with the `OptionDefinition` type:

    **Static Form**:
    ```typescript
    export const options: OptionDefinition[] = [
      { name: "add", type: String, group: "cmd-name", description: `...`}
    ]
    ```
   
    **Dynamic Form**
     ```typescript
     export function options(argv, opts): OptionDefinition[] {...}
     ```

5. **`excludeOptions`** - by default, all commands are seen as taking the _global options_ defined in `commands/global.ts`. A command can decide not to do anything with these options but if they do, it is considered _good form_ for them to explicitly exclude themself from that option.

## Commands: Moving Beyond One File
Outside of very simple commands, it's likely that a command will want to "spread out" across multiple files and there is no issue with that but there are some standards which help us to ensure that we have a dynamic import system that does not allow symbols to collide.

The `commands` directory is _autoindexed_ so that by simply adding in a file allows the command to become active. At the point that a commands demands the space that a folder provides then the suggestion is to move all command related matters into the folder. This means that a command lives entirely inside a file or entirely inside a folder. It's up to the command author. The indexing of the `commands` directory uses the "named-offset" strategy which works immediately for the "file" based command, for a folder you'll want to do the following:

   - `index.ts` - this should export just the named exports listed above
   - `private.ts` - this with be auto-indexed using the `named` strategy and all internal files to this command should import from this file exclusively. 

At that point of course, you can add any file and it's exported symbols will be available to peers via the `private.ts`.

