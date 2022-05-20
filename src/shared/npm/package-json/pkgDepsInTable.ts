import chalk from "chalk";
import { IDictionary } from "common-types";
import {  toTable } from "~/shared/ui";
import { getPackageJson, convertDepDictionaryToArray } from "~/shared/npm";

function formatDependencies(deps: Array<{ name: string; version: string }>) {
  return deps.map((dep) => chalk`{bold ${dep.name}} [{dim ${dep.version} }]`);
}

export interface IPkgDepsInTableOptions {
  ignoreDevDeps?: boolean;
  ignoreDeps?: boolean;
  ignoreOptionalDeps?: boolean;
  ignorePeerDeps?: boolean;
}

/**
 * Produces a tabular view of deps where columns are
 * Deps, Dev Deps, Peer Deps, Optional Deps. Only the
 * columns which have data will be shown.
 */
export function pkgDepsInTable(opts: IPkgDepsInTableOptions = {}) {
  const {
    dependencies,
    devDependencies,
    optionalDependencies,
    peerDependencies,
  } = getPackageJson();
  

  const deps = [
    { name: "Dependencies", data: opts.ignoreDeps ? undefined : dependencies },
    { name: "Peer Deps", data: opts.ignorePeerDeps ? undefined : peerDependencies },
    { name: "Optional Deps", data: opts.ignoreOptionalDeps ? undefined : optionalDependencies },
    { name: "Dev Deps", data: opts.ignoreDevDeps ? undefined : devDependencies },
  ]
    .filter((i) => i.data && Object.keys(i.data).length > 0)
    .map((i) => ({
      name: i.name,
      data: formatDependencies(convertDepDictionaryToArray(i.data as IDictionary<string>)),
    }));
  const columns = deps.map((i) => i.name);
  const max = Math.max(...deps.map((d) => d.data.length));

  const data: any[] = [];
  for (let idx = 0; idx < max; idx++) {
    const row: IDictionary = {};
    for (const col of columns) {
      const datum = deps.find((c) => c.name === col)?.data || [];
      row[col] = datum[idx] ? datum[idx] : "";
    }
    data.push(row);
  }

  return toTable(data, ...columns);
}
