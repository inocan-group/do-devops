import type { Stats } from "node:fs";

export interface IFileWithStats {
  file: string;
  stats: Stats;
}
