// src/optimizer.ts
import { normalizeTokenColor, generateTokenScale } from './tokens';
import { parseColor, rgbToHex, compositeOver } from './color';

/**
 * optimizeTokens:
 * - tokens: Record<string, string> (e.g. { '--primary': '#3498db' })
 * - options: { contrastBase, target, generateScale }
 */
export function optimizeTokens(tokens: Record<string,string>, options?: { contrastBase?:string, target?:number, generateScale?:number }) {
  const base = options?.contrastBase ?? '#ffffff';
  const target = options?.target ?? 4.5;
  const generateScale = options?.generateScale ?? 0;
  const normalized: Record<string,string | string[]> = {};
  for (const k of Object.keys(tokens)) {
    try {
      const norm = normalizeTokenColor(tokens[k], { contrastBase: base, target });
      if (generateScale > 0) {
        normalized[k] = generateTokenScale(norm as string, generateScale);
      } else {
        normalized[k] = norm as string;
      }
    } catch (e) {
      normalized[k] = tokens[k];
    }
  }
  return normalized;
}
