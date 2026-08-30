export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      out.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  out.push(current);
  return out;
}

export function parseCsv(text: string): Record<string, string>[] {
  const lines: string[] = [];
  let current = "";
  let inQuotes = false;
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    if (char === '"') inQuotes = !inQuotes;
    if (char === "\n" && !inQuotes) {
      if (current.trim()) lines.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) lines.push(current);
  if (lines.length < 2) return [];

  const aliases: Record<string, string> = {
    test: "name",
    testname: "name",
    assay: "name",
    category: "name",
    subcategory: "name",
    turnaround: "timeline",
    tat: "timeline",
    standardcode: "standard",
    methodname: "method",
    samplesize: "sample",
    sampleqty: "sample",
    remark: "notes",
    remarks: "notes",
    summary: "excerpt",
    body: "description",
    parent: "parentslug",
  };

  const headers = splitCsvLine(lines[0]).map((header) => {
    const key = header.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
    return aliases[key] || key;
  });

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      if (!header) return;
      row[header] = (values[index] || "").trim();
    });
    return row;
  });
}

export function slugify(value: string, fallback = "item") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || fallback;
}
