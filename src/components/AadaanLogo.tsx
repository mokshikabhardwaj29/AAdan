import React from 'react';

interface AadaanLogoProps {
  className?: string;
  size?: number | string;
  isDarkMode?: boolean;
}

/**
 * Exact replica of the आDaan circular logo emblem:
 * - Center: Terracotta (left) / Forest green (right) handshake — farmer cooperation and trust.
 * - Right side: Forest green mechanical gear ring wrapping the handshake — farm mechanization & rewiring,
 *   with a small circuit "node" dot representing the tech/connectivity layer.
 * - Top center: A single sprouting seedling (two leaves) rising from the handshake.
 */
export const AadaanLogoEmblem: React.FC<AadaanLogoProps> = ({
  className = "w-10 h-10",
  size,
  isDarkMode = false,
}) => {
  const copperColor = isDarkMode ? "#e07a4f" : "#b65835";
  const greenColor = isDarkMode ? "#4ade80" : "#215e3c";

  // Gear teeth radiating around the right side of the emblem
  const gearCx = 66;
  const gearCy = 64;
  const rInner = 28;
  const rOuter = 35;
  const gearTeeth = Array.from({ length: 9 }).map((_, i) => {
    const angle = -105 + i * 24; // sweeps the right-hand arc
    const rad = (angle * Math.PI) / 180;
    return {
      x1: gearCx + rInner * Math.cos(rad),
      y1: gearCy + rInner * Math.sin(rad),
      x2: gearCx + rOuter * Math.cos(rad),
      y2: gearCy + rOuter * Math.sin(rad),
    };
  });

  // Inner gear rim arc (right-hand semicircle)
  const rimStart = {
    x: gearCx + rInner * Math.cos((-105 * Math.PI) / 180),
    y: gearCy + rInner * Math.sin((-105 * Math.PI) / 180),
  };
  const rimEnd = {
    x: gearCx + rInner * Math.cos((87 * Math.PI) / 180),
    y: gearCy + rInner * Math.sin((87 * Math.PI) / 180),
  };

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circular boundary / background */}
      <circle
        cx="60"
        cy="60"
        r="56"
        className={isDarkMode ? "fill-[#0e1d13] stroke-[#24422c]" : "fill-[#faf6ef] stroke-[#ebdcc4]"}
        strokeWidth="1.5"
      />

      {/* TOP: SPROUTING SEEDLING */}
      <path
        d="M60 66 C60 56 60 46 60 36"
        stroke={greenColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Left leaf */}
      <path
        d="M60 42 C50 40 42 30 46 18 C56 20 62 32 60 42 Z"
        stroke={greenColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M50 24 C54 30 58 36 60 42"
        stroke={greenColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Right leaf */}
      <path
        d="M60 42 C70 40 78 30 74 18 C64 20 58 32 60 42 Z"
        stroke={greenColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M70 24 C66 30 62 36 60 42"
        stroke={greenColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* LEFT ARM (copper) leading into the handshake */}
      <path
        d="M22 92 C26 80 34 72 44 69 C49 67.5 53 68 57 70"
        stroke={copperColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M28 96 C32 85 38 78 46 74"
        stroke={copperColor}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* RIGHT ARM (green) leading into the handshake, blending into the gear */}
      <path
        d="M96 88 C90 78 82 71 73 69 C68 67.5 64 68 60 70"
        stroke={greenColor}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* CLASPED HANDS: interlocking fingers at the center */}
      <path
        d="M57 70 C58 66 61 64 64 65"
        stroke={copperColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M60 74 C61 70 64 68 67 69"
        stroke={copperColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M56 78 C57 74 60 72 63 73"
        stroke={copperColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M63 65 C64 69 62 72 59 73"
        stroke={greenColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M66 69 C67 73 65 76 62 77"
        stroke={greenColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M62 73 C63 77 61 80 58 81"
        stroke={greenColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Wrist contour joining hands to arms */}
      <path
        d="M50 82 C54 85 60 86 65 84"
        stroke={copperColor}
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* RIGHT SIDE: GEAR RING (mechanization / rewired) */}
      <path
        d={`M ${rimStart.x} ${rimStart.y} A ${rInner} ${rInner} 0 1 1 ${rimEnd.x} ${rimEnd.y}`}
        stroke={greenColor}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      {gearTeeth.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={greenColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}

      {/* Circuit / tech node dot on the gear */}
      <path
        d="M78 32 C84 28 89 29 89 29"
        stroke={greenColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="91" cy="28" r="2.6" fill={greenColor} />
    </svg>
  );
};

export const AadaanBrandText: React.FC<{ isDarkMode?: boolean; size?: 'sm' | 'md' | 'lg' }> = ({
  isDarkMode = false,
  size = 'md',
}) => {
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';
  const subSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[11px]';

  return (
    <div className="flex flex-col">
      <div className={`flex items-center ${textSize} font-black tracking-tight leading-none`}>
        <span className={isDarkMode ? "text-[#e07a4f]" : "text-[#b65835]"}>
          आ
        </span>
        <span className={isDarkMode ? "text-[#4ade80]" : "text-[#215e3c]"}>
          Daan
        </span>
      </div>
      <span className={`${subSize} tracking-tight font-medium ${isDarkMode ? "text-[#9cb5a0]" : "text-[#6d5e4d]"}`}>
        Rural Exchange. Rewired.
      </span>
    </div>
  );
};