// Стандарден ISO 8601 week broj (недела почнува во понеделник, првата недела
// е онаа што го содржи првиот четврток од годината).
export function getISOWeekString(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Понеделник = 0
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // Четврток од таа недела
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstThursdayDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstThursdayDayNum + 3);
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function getWeekRange(weekString: string): { start: Date; end: Date } {
  const [yearStr, weekStr] = weekString.split("-W");
  const year = Number(yearStr);
  const week = Number(weekStr);

  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4DayNum = (jan4.getUTCDay() + 6) % 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - jan4DayNum);

  const start = new Date(week1Monday);
  start.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  return { start, end };
}

export function formatWeekLabel(weekString: string): string {
  const { start, end } = getWeekRange(weekString);
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  return `${fmt(start)} – ${fmt(end)}, ${start.getUTCFullYear()}`;
}