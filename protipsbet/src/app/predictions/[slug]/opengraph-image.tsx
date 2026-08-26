import { ImageResponse } from "next/og";
import { getAllTips, buildSlug, findTipBySlug, isPubliclyRenderable } from "@/lib/predictions";
import { getTipStatus, formatDate } from "@/lib/tip-format";
import { MARKET_LABELS } from "@/lib/tips-data";
import { classifyMarket } from "@/lib/market-slug";

export const runtime = "edge";
export const alt = "ProTipsBet Match Prediction";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { slug: string };
}

export default async function Image({ params }: Props) {
  const tips = await getAllTips();
  const tip = findTipBySlug(tips.filter(isPubliclyRenderable), params.slug);

  // Fallback ако мечот не постои (пр. слика се бара за стар/избришан slug) -
  // прикажи генеричка верзија наместо да падне build/request.
  if (!tip) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
          }}
        >
          <div style={{ display: "flex", fontSize: 72, fontWeight: 900, color: "white" }}>
            ProTipsBet
          </div>
        </div>
      ),
      { ...size }
    );
  }

  const status = getTipStatus(tip.result);
  const marketKey = classifyMarket(tip.predictionType);
  const marketLabel = marketKey ? MARKET_LABELS[marketKey] : tip.predictionType || "Prediction";

  const statusColor = status === "win" ? "#34d399" : status === "loss" ? "#f87171" : "#fbbf24";
  const statusText = status === "win" ? "✓ WON" : status === "loss" ? "✗ LOST" : "PENDING";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 32,
          }}
        >
          <span
            style={{
              color: statusColor,
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 2,
              textTransform: "uppercase",
              border: `2px solid ${statusColor}`,
              borderRadius: 8,
              padding: "6px 16px",
            }}
          >
            {statusText}
          </span>
          <span
            style={{
              color: "#34d399",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            {tip.league && tip.league !== "Unknown" && tip.league !== "VIP Only" ? tip.league : "Football"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 58,
              fontWeight: 900,
              color: "white",
              textAlign: "center",
              maxWidth: 1000,
              justifyContent: "center",
              lineHeight: 1.15,
            }}
          >
            {tip.homeTeam}
          </div>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#71717a" }}>vs</div>
          <div
            style={{
              display: "flex",
              fontSize: 58,
              fontWeight: 900,
              color: "white",
              textAlign: "center",
              maxWidth: 1000,
              justifyContent: "center",
              lineHeight: 1.15,
            }}
          >
            {tip.awayTeam}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(16,185,129,0.1)",
              border: "2px solid rgba(16,185,129,0.3)",
              borderRadius: 12,
              padding: "12px 24px",
            }}
          >
            <span style={{ color: "#a1a1aa", fontSize: 20, fontWeight: 600 }}>{marketLabel}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(16,185,129,0.1)",
              border: "2px solid rgba(16,185,129,0.3)",
              borderRadius: 12,
              padding: "12px 24px",
            }}
          >
            <span style={{ color: "#34d399", fontSize: 24, fontWeight: 900 }}>@{Number(tip.odds).toFixed(2)}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#71717a",
            fontWeight: 600,
            marginTop: 40,
          }}
        >
          {formatDate(tip.matchDate)} • ProTipsBet.com
        </div>
      </div>
    ),
    { ...size }
  );
}