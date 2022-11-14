import type { FunctionConfiguration } from "aws-sdk/clients/lambda";
import chalk from "chalk";
import { IServerlessFunctionConfig } from "common-types";
import { toTable } from "src/shared/ui";

export function functionsApiTable(fns: FunctionConfiguration[]) {
  return toTable<FunctionConfiguration>(
    fns,
    {
      col: "FunctionName",
      name: "Function",
      formula: (f) =>
        `{dim ${String(f).split("-").slice(0, -1).join("-")}-}{bold ${String(f)
          .split("-")
          .slice(-1)}}`,
      format: { width: 45, alignment: "left" },
    },
    {
      col: "MemorySize",
      name: "Memory",
      format: { width: 8, alignment: "center" },
      minWidth: 104,
    },
    {
      col: "CodeSize",
      name: "Code Size",
      formula: (cs) => `${Math.floor(Number(cs) / 10_000) * 10} {italic kb}`,
      format: { width: 12, alignment: "right" },
      minWidth: 130,
    },
    {
      col: "Timeout",
      formula: (t) => `${t}s`,
      format: { width: 8, alignment: "right" },
      minWidth: 123,
    },
    {
      col: "Layers",
      formula: (i) =>
        Array.isArray(i)
          ? i.map((i: any) => i?.Arn.split(":").slice(-2).join(":") || "").join("\n")
          : "",
      format: { width: 20, alignment: "center" },
      minWidth: 155,
    },
    {
      col: "Description",
      format: { width: 42, alignment: "left", wrapWord: true },
    }
  );
}

export function functionsLocalTable(fns: Array<IServerlessFunctionConfig & { name: string }>) {
  return toTable(
    fns,
    {
      col: "name",
      name: "Function",
      formula: (f) =>
        `{dim ${String(f).split("-").slice(0, -1).join("-")}-}{bold ${String(f)
          .split("-")
          .slice(-1)}}`,
      format: { width: 45, alignment: "left" },
    },
    {
      col: "memorySize",
      name: "Memory",
      formula: (m) => (m ? m : chalk.grey("1024")),
      format: { width: 8, alignment: "center" },
      minWidth: 104,
    },
    {
      col: "timeout",
      name: "Timeout",
      formula: (t) => (t ? `${t}s` : chalk.gray("3s")),
      format: { width: 8, alignment: "right" },
      minWidth: 123,
    },
    {
      col: "events",
      name: "Events",
      formula: (events) => (Array.isArray(events) ? events.map((evt) => Object.keys(evt)) : []),
      format: { width: 20, alignment: "center" },
      minWidth: 155,
    },
    {
      name: "Description",
      col: "description",
      formula: (d) => (d ? d : chalk.italic.dim("no description")),
      format: { width: 42, alignment: "left", wrapWord: true },
    }
  );
}
