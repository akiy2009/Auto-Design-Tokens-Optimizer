// src/tokens.ts
import { parseColor, rgbToHsl, hslToRgb, rgbToHex, adjustLightnessToTarget, contrastRatio } from './color';

export function normalizeTokenColor(hex:string, opts?: { contrastBase?:string, target?:number }) {
  const base = opts?.contrastBase ?? '#ffffff';
  const target = opts?.target ?? 4.5;
  const res = adjustLightnessToTarget(hex, base, target);
  return res.color;
}

export function generateTokenScale(baseHex:string, steps=10) {
  const rgb = parseColor(baseHex);
  const hsl = rgbToHsl(rgb);
  const span = 0.55;
  const out:string[] = [];
  for (let i=0;i<steps;i++){
    const t = i/(steps-1);
    const L = Math.max(0, Math.min(1, hsl.l + (0.5 - t)*span));
    out.push(rgbToHex(hslToRgb({ h: hsl.h, s: hsl.s, l: L })));
  }
  return out;
}

export function validateTokens(tokens: Record<string,string>, opts?: { contrastBase?:string, target?:number }) {
  const base = opts?.contrastBase ?? '#ffffff';
  const target = opts?.target ?? 4.5;
  const out: Record<string,{ok:boolean, contrast:number}> = {};
  for (const k of Object.keys(tokens)) {
    const cr = contrastRatio(tokens[k], base);
    out[k] = { ok: cr >= target, contrast: cr };
  }
  return out;
}
