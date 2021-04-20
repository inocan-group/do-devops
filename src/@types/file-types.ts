import type { Stats } from "fs";

export interface IFileWithStats {
  file: string;
  stats: Stats;
}
