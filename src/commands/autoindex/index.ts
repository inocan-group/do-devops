import { createCommand } from "src/shared/core/commands/createCommand";
import { askForAutoindexConfig } from "src/shared/interactive";
import { description, options } from "./parts/index";
import { exit } from "node:process";
import { getSources } from "./private/getSources";

const command = createCommand(
  "autoindex",
  async({argv, opts, observations, log}) => {
    if (opts.config) {
      await askForAutoindexConfig(opts, observations);
      exit();
    }
    /** one or more "sources" to base our evaluation on */
    const sources = getSources(argv, opts, observations, log);
    const watching = [];
    for (const s of sources) {
      validateSource(s);
      if(opts.watch) {
        watching.push(watchSource(s));
      }
    }
  },
  description,
  {
    options,
    config: () => askForAutoindexConfig
  }
);

export default command;
