/**
 * Convert a hex string to an { r, g, b } object.
 * Supports 3‑ or 6‑digit hex, with or without leading '#'.
 */
function hexToRgb(hex: string) {
  const cleanHex = hex.replace(/^#/, '');
  const bigint = parseInt(cleanHex, 16);
  const isThreeDigit = cleanHex.length === 3;
  const r = isThreeDigit ? (bigint >> 8) & 0xf : (bigint >> 16) & 0xff;
  const g = isThreeDigit ? (bigint >> 4) & 0xf : (bigint >> 8) & 0xff;
  const b = isThreeDigit ? bigint & 0xf : bigint & 0xff;
  // Scale 4‑bit values (0–15) to 8‑bit (0–255)
  return {
    r: isThreeDigit ? r * 17 : r,
    g: isThreeDigit ? g * 17 : g,
    b: isThreeDigit ? b * 17 : b,
  };
}

/**
 * Calculate Euclidean distance between two RGB colors.
 */
function colorDistance(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
    Math.pow(a.g - b.g, 2) +
    Math.pow(a.b - b.b, 2)
  );
}

/**
 * Find the palette entry that is numerically closest to the target hex color.
 * @param hex      - Target hex color (e.g. "#ff5733" or "ff5733")
 * @param palette  - Array of hex strings to compare against
 * @returns        - The closest palette hex string
 */
export function getClosestColor(hex: string, palette: string[]): string {
  const targetRgb = hexToRgb(hex);

  let closest = palette[0];
  let minDist = Infinity;

  for (const candidateHex of palette) {
    const candidateRgb = hexToRgb(candidateHex);
    const dist = colorDistance(targetRgb, candidateRgb);
    if (dist < minDist) {
      minDist = dist;
      closest = candidateHex;
    }
  }

  return closest;
}