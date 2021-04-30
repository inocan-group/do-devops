import { IDiscoveredConfig } from "~/@types";

export function reportOnFnConfig(fns: Array<IDiscoveredConfig | undefined>) {
  const interfaces = new Set<string>();
  const usage: {
    withConfig: number;
    noConfig: number;
    handlersWithConfig: string[];
  } = {
    withConfig: 0,
    noConfig: 0,
    handlersWithConfig: [],
  };

  for (const c of fns) {
    if (!c) {
      usage.noConfig++;
      continue;
    }

    if (c.interface === `IWrapperFunction`) {
      usage.withConfig++;
      usage.handlersWithConfig.push(c.config.handler);
    }
    interfaces.add(c.interface);
  }

  return { interfaces, usage };
}
