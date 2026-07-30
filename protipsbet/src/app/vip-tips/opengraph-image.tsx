import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ProTipsBet VIP — Premium Sports Predictions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #09090b 0%, #1c1408 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <span style={{ color: "#fbbf24", fontSize: 24, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>
            👑 VIP Analytics
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 900, color: "white", letterSpacing: -2 }}>
          Premium Picks
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa", marginTop: 16, fontWeight: 600 }}>
          Verified Win Rate • Premium Odds
        </div>
      </div>
    ),
    { ...size }
  );
}