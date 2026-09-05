export const getTipStatus = (result?: string) => {
  const normalized = result?.toLowerCase();
  if (normalized === "win") return "win" as const;
  if (normalized === "loss") return "loss" as const;
  return "pending" as const;
};

export const formatMatchTime = (value?: string) => {
  if (!value) return "TBD";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBD";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
};

function toLocalDateKey(date: Date) {
  return date.toLocaleDateString("en-CA");
}

export function isToday(value?: string) {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  return toLocalDateKey(d) === toLocalDateKey(new Date());
}

export function isYesterday(value?: string) {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  return toLocalDateKey(d) === toLocalDateKey(yest);
}

export function matchesMarketFilter(predictionType: string | undefined, filter: string): boolean {
  const p = (predictionType ?? "").toUpperCase();
  const isHtFt = p.includes("HT/FT") || p.includes("HT-FT") || p.includes("HTFT");

  if (filter === "HTFT") {
    return isHtFt;
  }
  if (filter === "1X2") {
    return !isHtFt && /(HOME|AWAY|DRAW|\(1\)|\(X\)|\(2\))/.test(p);
  }
  if (filter === "BTTS") {
    return p.includes("BTTS");
  }
  if (filter === "OU25") {
    return p.includes("OVER") || p.includes("UNDER") || p.includes("2.5");
  }
  return false;
}