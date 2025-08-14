import { useState, useEffect } from "react";

// Tailwind defaults + custom breakpoint
const breakpoints: Record<string, number> = {
  sm: 640,
  md: 768,
  tb: 850,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// Colors for background per breakpoint
const breakpointColors: Record<string, string> = {
  sm: "#ff7f50",     // coral
  md: "#ffd700",     // gold
  tb: "#00ffff",     // cyan
  lg: "#32cd32",     // lime green
  xl: "#1e90ff",     // dodger blue
  "2xl": "#9400d3",  // dark violet
};

interface Size {
  w: number;
  h: number;
}

function getBreakpoint(width: number): string {
  const entries = Object.entries(breakpoints).sort((a, b) => a[1] - b[1]);
  let active = `below ${entries[0][0]}`;
  for (const [name, minWidth] of entries) {
    if (width >= minWidth) {
      active = name;
    }
  }
  return active;
}

// Calculate contrast color (black/white) based on background
function getContrastColor(hex: string): string {
  // Remove #
  const c = hex.startsWith("#") ? hex.slice(1) : hex;
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  // Perceived luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff"; // dark text on light bg, light text on dark bg
}

export default function ScreenInfoOverlay() {
  const [viewport, setViewport] = useState<Size>({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  const [screenRes] = useState<Size>({
    w: window.screen.width,
    h: window.screen.height,
  });

  const [breakpoint, setBreakpoint] = useState<string>(
    getBreakpoint(window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setViewport({ w, h });
      setBreakpoint(getBreakpoint(w));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bgColor = breakpointColors[breakpoint] || "rgba(0,0,0,0.75)";
  const textColor = bgColor.startsWith("#") ? getContrastColor(bgColor) : "#0f0";

  return (
    <div
      style={{
        position: "fixed",
        top: "200px",
        right: "10px",
        background: bgColor,
        color: textColor,
        padding: "8px 12px",
        borderRadius: "8px",
        fontSize: "14px",
        fontFamily: "monospace",
        zIndex: 9999,
      }}
    >
      <div>Viewport: {viewport.w} × {viewport.h}px</div>
      <div>Screen: {screenRes.w} × {screenRes.h}px</div>
      <div>Breakpoint: {breakpoint} (≥{breakpoints[breakpoint] || 0}px)</div>
    </div>
  );
}
