const toDot = (yearMonth: string) => yearMonth.replace('-', '.');

/** '2023-03' → '2023.03 – 현재', ('2023-03', '2024-12') → '2023.03 – 2024.12' */
export function formatPeriod(start: string, end?: string): string {
  return `${toDot(start)} – ${end ? toDot(end) : '현재'}`;
}
