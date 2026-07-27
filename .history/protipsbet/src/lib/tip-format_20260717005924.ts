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