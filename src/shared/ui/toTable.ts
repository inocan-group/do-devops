import chalk from "chalk";
import { table, ColumnUserConfig } from "table";
import { DevopsError } from "~/errors";
import { emoji } from ".";
import { consoleDimensions } from "./consoleDimensions";

export type ColumnOnly<K> = K;
export type ColumnFormulaTuple<T extends object, K extends keyof T = keyof T> = [
  K,
  (prop: T[K]) => unknown
];
export type AdvancedColumn<T extends object, K extends keyof T & string = keyof T & string> = {
  col: K;
  formula?: (prop: T[K]) => unknown;
  /** by default the column is the name but you can specify your own where required */
  name?: string;
  /** the minimum width of the console for this column to appear */
  minWidth?: number;
  format?: ColumnUserConfig;
};

export type TableColumn<T extends object, K extends keyof T & string> =
  | ColumnOnly<K>
  | ColumnFormulaTuple<T, K>
  | AdvancedColumn<T, K>;

export function isAdvancedColumn<T extends object, K extends keyof T & string>(
  col: TableColumn<T, K>
): col is AdvancedColumn<T, K> {
  return col !== null && typeof col === "object";
}

export function isColumnTuple<T extends object, K extends keyof T & string>(
  col: TableColumn<T, K>
): col is ColumnFormulaTuple<T, K> {
  return Array.isArray(col);
}

function headerCol(name: string) {
  return chalk.bold.blue(name);
}

/**
 * **toTable**
 *
 * Utility function to take an array of values -- in dictionary form --
 * and return them back in a form which can be brought into the `table`
 * library as data.
 */
export function toTable<T extends object, K extends keyof T & string = keyof T & string>(
  data: T[],
  ...columns: TableColumn<T, K>[]
) {
  const ui = consoleDimensions();
  const hiddenColumns: string[] = [];
  const headerRow: unknown[] = [];
  const colConfig: ColumnUserConfig[] = [];

  // Show Headers First
  for (const col of columns) {
    if (isAdvancedColumn(col)) {
      if (col.minWidth === undefined || col.minWidth < ui.width) {
        headerRow.push(headerCol(col.name || (col.col as string)));
        if (col.format) {
          colConfig.push(col.format);
        }
      } else {
        hiddenColumns.push(col.name || col.col);
      }
    } else {
      headerRow.push(headerCol(Array.isArray(col) ? col[0] : col));
      colConfig.push({});
    }
  }

  const rows = data.map((rowData) => {
    const row: unknown[] = [];

    for (const col of columns) {
      if (isColumnTuple(col)) {
        const [prop, fn] = col;
        row.push(fn(rowData[prop]));
      } else if (isAdvancedColumn(col)) {
        if (col.minWidth === undefined || col.minWidth < ui.width) {
          row.push(col.formula ? col.formula(rowData[col.col]) : rowData[col.col]);
        }
      } else {
        row.push(rowData[col]);
      }
    }
    return row;
  });

  const hiddenColMessage =
    hiddenColumns.length > 0
      ? chalk`\n\n{gray - {bold Note:} some columns hidden due to available width [{dim ${
          ui.width
        }}]: {italic ${hiddenColumns.join(", ")}}}`
      : "";

  // Iterate through data
  const tableData: unknown[][] = [headerRow, ...rows];

  try {
    return table(tableData, { columns: colConfig }) + hiddenColMessage;
  } catch (error) {
    const errMessage =
      (error as Error).message === "Table must have a consistent number of cells."
        ? `     - table row lengths are: \n${tableData.map((i) => i.length)}`
        : `- ${emoji.poop} problems building table: ${(error as Error).message}`;
    throw new DevopsError(errMessage, "ui/invalid-table-data");
  }
}
