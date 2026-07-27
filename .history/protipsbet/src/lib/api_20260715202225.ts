cat > /root/ProTipsBet/protipsbet/src/lib/api.ts << 'EOF'
export const API_BASE = "https://protipsbet.com";

export function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("protipsbet_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
EOF