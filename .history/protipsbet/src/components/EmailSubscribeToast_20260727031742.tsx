"use client";

import { useEffect, useState } from "react";

export default function EmailSubscribeToast() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  console.log("[EmailSubscribeToast] component function ran, visible =", visible);

  useEffect(() => {
    console.log("[EmailSubscribeToast] useEffect fired, starting 5s timer");
    const t = setTimeout(() => {
      console.log("[EmailSubscribeToast] timer done, setting visible = true");
      setVisible(true);
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) {
    return null;
  }

  console.log("[EmailSubscribeToast] rendering the visible toast now");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.protipsbet.com";
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "150px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "#111",
        border: "2px solid #38bdf8",
        borderRadius: "16px",
        padding: "16px",
        width: "90%",
        maxWidth: "360px",
        color: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      {status === "success" ? (
        <p style={{ margin: 0, fontWeight: "bold", color: "#34d399" }}>
          You're subscribed! 🎉
        </p>
      ) : (
        <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "8px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Get free & VIP tip alerts"
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #444",
              background: "#222",
              color: "white",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              background: "#0ea5e9",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {status === "loading" ? "..." : "Notify me"}
          </button>
        </form>
      )}
      <button
        onClick={() => setVisible(false)}
        style={{
          position: "absolute",
          top: "4px",
          right: "8px",
          background: "transparent",
          border: "none",
          color: "#888",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ×
      </button>
    </div>
  );
}