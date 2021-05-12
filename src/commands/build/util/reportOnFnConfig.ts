import { IDiscoveredConfig } from "~/@types";

export function reportOnFnConfig(fns: Array<IDiscoveredConfig | undefined>) {
  const interfaces = new Set<string>();
  const usage: {
    withWrapperFunction: number;
    withOtherInterface: number;
    noConfig: number;
    handlersWithWrapperFunction: string[];
    handlersWithOtherInterface: string[];
  } = {
    withWrapperFunction: 0,
    withOtherInterface: 0,
    noConfig: 0,
    handlersWithWrapperFunction: [],
    handlersWithOtherInterface: [],
  };

  for (const c of fns) {
    if (!c) {
      usage.noConfig++;
      continue;
    }

    if (c.interface === `IWrapperFunction`) {
      usage.withWrapperFunction++;
      usage.handlersWithWrapperFunction.push(c.config.handler);
    } else {
      usage.withOtherInterface++;
      usage.handlersWithOtherInterface.push(c.config.handler);
    }
    interfaces.add(c.interface);
  }

  return { interfaces, usage };
}
