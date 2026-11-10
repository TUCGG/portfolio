const toDot = (yearMonth: string) => yearMonth.replace('-', '.');

/** '2023-03' → '2023.03 – 현재', ('2023-03', '2024-12') → '2023.03 – 2024.12' */
export function formatPeriod(start: string, end?: string): string {
  return `${toDot(start)} – ${end ? toDot(end) : '현재'}`;
}

/** 한국 시간 기준 'YYYY-MM'. 빌드 서버(UTC)와 날짜가 달라지지 않게 한다. */
const yearMonthInSeoul = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit'}).format(date);

const toIndex = (yearMonth: string) => {
  const [year, month] = yearMonth.split('-').map(Number);
  return year * 12 + (month - 1);
};

/** 시작 달과 끝 달을 모두 센 개월 수. 끝이 없으면 오늘이 속한 달까지 센다. */
export function monthsBetween(start: string, end?: string, now = new Date()): number {
  return toIndex(end ?? yearMonthInSeoul(now)) - toIndex(start) + 1;
}

/** 27 → '2년 3개월', 11 → '11개월', 24 → '2년' */
export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years > 0 && `${years}년`, rest > 0 && `${rest}개월`].filter(Boolean).join(' ');
}
