import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ProTipsBet Free Tips — Daily Football Predictions";
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
          background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#34d399" }} />
          <span style={{ color: "#34d399", fontSize: 24, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>
            Free Daily Tips
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 900, color: "white", letterSpacing: -2 }}>
          Test Our Accuracy
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa", marginTop: 16, fontWeight: 600 }}>
          Verified & Public — No Signup Required
        </div>
      </div>
    ),
    { ...size }
  );
}