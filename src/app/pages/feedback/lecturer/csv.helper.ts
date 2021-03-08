const escape = (val: string) => `"${val}"`;

const SEPARATOR_CHAR = ';';

const forceUtf8 = (val: string) => `\uFEFF${val}`;

export const createCsv = (rows: Csv) =>
  forceUtf8(rows.map((val) => val.map(escape).join(SEPARATOR_CHAR)).join('\n'));

export type Csv = string[][];
