import "./test-console"; // TS declaration
import parse from "destr";
import { stderr, stdout } from "test-console";
import { IDictionary } from "common-types";
import fs from "node:fs";
import process from "node:process";
import yaml from "js-yaml";

interface Console {
  _restored: boolean;
  // Console: typeof NodeJS.Console;
  assert(value: any, message?: string, ...optionalParams: any[]): void;
  dir(obj: any, options?: { showHidden?: boolean; depth?: number; colors?: boolean }): void;
  error(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  log(message?: any, ...optionalParams: any[]): void;
  time(label: string): void;
  timeEnd(label: string): void;
  trace(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
}

declare var console: Console;

export type IRestoreConsole<T = void> = () => T;

export function restoreStdoutAndStderr() {
  console._restored = true;
}

export async function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function setupEnv() {
  if (!process.env.AWS_STAGE) {
    process.env.AWS_STAGE = "test";
  }
  const envFile = process.env.ENV_FILE || ".env";
  const yamlConfig: IDictionary = parse(yaml.load(fs.readFileSync(envFile, "utf8"))) as {};
  const combined: IDictionary = {
    ...yamlConfig[process.env.AWS_STAGE],
    ...process.env,
  };

  console.log(`Loading ENV for "${process.env.AWS_STAGE}"`);
  for (const key of Object.keys(combined)) {
    process.env[key] = combined[key];
  }
  return combined;
}

export function ignoreStdout() {
  const rStdout = stdout.ignore();
  const restore: () => void = () => {
    rStdout();
    console._restored = true;
  };

  return restore;
}

export function captureStdout() {
  const rStdout: IAsyncStreamCallback = stdout.inspect();
  const restore: () => string[] = () => {
    rStdout.restore();
    console._restored = true;
    return rStdout.output;
  };

  return restore;
}

export function captureStderr() {
  const rStderr: IAsyncStreamCallback = stderr.inspect();
  const restore: () => string[] = () => {
    rStderr.restore();
    console._restored = true;
    return rStderr.output;
  };

  return restore;
}

export function ignoreStderr() {
  const rStdErr = stderr.ignore();
  const restore: () => void = () => {
    rStdErr();
    console._restored = true;
  };

  return restore;
}

export function ignoreBoth() {
  const rStdOut = stdout.ignore();
  const rStdErr = stderr.ignore();
  const restore: () => void = () => {
    rStdOut();
    rStdErr();
    console._restored = true;
  };

  return restore;
}

export function valuesOf<T = any>(listOf: IDictionary<T>, property: string) {
  const keys: any[] = Object.keys(listOf);
  return keys.map((key: any) => {
    const item = listOf[key] as IDictionary;
    return item[property];
  });
}

export function length(listOf: IDictionary) {
  return listOf ? Object.keys(listOf).length : 0;
}

// export async function loadData(file: string) {
//   return new Promise<string>((resolve, reject) => {
//     fs.readFile(process.cwd() + "/test/data/" + file, "utf8", (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data);
//       }
//     });
//   });
// }
