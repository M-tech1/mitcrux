/* Minimal, dependency-free CSV export for admin reports */

type Cell = string | number | boolean | null | undefined;

function escape(cell: Cell) {
  const s = cell === null || cell === undefined ? "" : String(cell);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers: string[], rows: Cell[][]) {
  return [headers, ...rows].map((r) => r.map(escape).join(",")).join("\r\n");
}

/** Triggers a browser download. A BOM keeps Excel reading UTF-8 (₦, accents) correctly. */
export function downloadCsv(filename: string, headers: string[], rows: Cell[][]) {
  const blob = new Blob(["﻿" + toCsv(headers, rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
