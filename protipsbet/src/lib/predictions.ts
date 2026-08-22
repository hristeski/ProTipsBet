import { API_BASE } from "@/lib/api";
import type { PredictionTip } from "@/lib/prediction-slug";

export * from "@/lib/prediction-slug";

export async function getAllTips(): Promise<PredictionTip[]> {
  try {
    const res = await fetch(`${API_BASE}/api/tips`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}