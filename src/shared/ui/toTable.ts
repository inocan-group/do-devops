/**
 * **toTable**
 *
 * Utility function to take an array of values -- in dictionary form --
 * and return them back in a form which can be brought into the `table`
 * library as data.
 */
export function toTable<T extends object, K extends keyof T = keyof T>(
  data: T[],
  ...columns: Array<K | [K, (prop: T[K]) => unknown]>
): unknown[][] {
  return data.map((rowData) => {
    const row: unknown[] = [];
    for (const col of columns) {
      if (Array.isArray(col) && typeof col[1] === "function") {
        const [prop, fn] = col;
        row.push(fn(rowData[prop]));
      } else {
        row.push(rowData[col as keyof typeof rowData]);
      }
    }
    return row;
  });
}
