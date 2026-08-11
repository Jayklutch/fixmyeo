import { useRef, useState, useEffect } from "react";

export default function Toggle({ enabled, onChange }) {
  return (
    <div
      className="relative w-40 h-20 rounded-full transition-colors cursor-pointer select-none border"
      style={{
        touchAction: "manipulation",
        background: enabled ? "var(--eo-accent-dim)" : "var(--eo-panel-raised)",
        borderColor: enabled ? "var(--eo-accent)" : "var(--eo-border-strong)",
      }}
      onClick={() => onChange(!enabled)}
    >
      {/* ON / OFF marks */}
      <span
        className="eo-mono absolute top-1/2 -translate-y-1/2 left-5 text-xs font-bold"
        style={{ color: enabled ? "var(--eo-accent)" : "transparent", transition: "color 0.15s" }}
      >
        ON
      </span>
      <span
        className="eo-mono absolute top-1/2 -translate-y-1/2 right-5 text-xs font-bold"
        style={{ color: !enabled ? "var(--eo-text-dim)" : "transparent", transition: "color 0.15s" }}
      >
        OFF
      </span>

      {/* Thumb */}
      <div
        className="absolute top-2 w-16 h-16 rounded-full shadow-md transition-transform"
        style={{
          background: enabled ? "var(--eo-accent)" : "var(--eo-text-dim)",
          transform: enabled ? "translateX(88px)" : "translateX(8px)"
        }}
      />
    </div>
  );
}
