// src/color.ts
export type RGB = { r:number; g:number; b:number; a?:number };
export type HSL = { h:number; s:number; l:number; a?:number };

const clamp = (v:number, a=0, b=1)=> Math.min(b, Math.max(a,v));

function parseIntSafe(s:string, base=10){ return parseInt(s, base); }

/** parseColor: hex / #rgb / #rrggbb / #rrggbbaa / rgb()/rgba()/hsl()/hsla() */
export function parseColor(input:string): RGB {
  if (!input) throw new Error('empty color');
  let s = input.trim();
  // hex
  const hex = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
  const mHex = s.match(hex);
  if (mHex) {
    let h = mHex[1];
    if (h.length === 3 || h.length === 4) h = h.split('').map(c=>c+c).join('');
    const r = parseIntSafe(h.slice(0,2),16);
    const g = parseIntSafe(h.slice(2,4),16);
    const b = parseIntSafe(h.slice(4,6),16);
    const a = h.length === 8 ? parseIntSafe(h.slice(6,8),16)/255 : 1;
    return { r,g,b,a };
  }
  // rgb(a)
  const rgbRe = /^rgba?\(\s*([^\)]+)\s*\)$/i;
  const mRgb = s.match(rgbRe);
  if (mRgb) {
    const parts = mRgb[1].split(',').map(p=>p.trim());
    const parseComp = (t:string)=>{
      if (t.endsWith('%')) return Math.round(parseFloat(t)/100 * 255);
      return Math.round(parseFloat(t));
    };
    const r = parseComp(parts[0]);
    const g = parseComp(parts[1]);
    const b = parseComp(parts[2]);
    const a = parts[3] ? parseFloat(parts[3]) : 1;
    return { r,g,b,a: clamp(a,0,1) };
  }
  // hsl(a)
  const hslRe = /^hsla?\(\s*([^\)]+)\s*\)$/i;
  const mHsl = s.match(hslRe);
  if (mHsl) {
    const parts = mHsl[1].split(',').map(p=>p.trim());
    const h = parseFloat(parts[0]);
    const sPer = parseFloat(parts[1].replace('%',''))/100;
    const lPer = parseFloat(parts[2].replace('%',''))/100;
    const a = parts[3] ? parseFloat(parts[3]) : 1;
    return hslToRgb({ h, s: sPer, l: lPer, a });
  }
  throw new Error('Unsupported color format: '+input);
}

export function rgbToHex({ r,g,b,a }:RGB): string {
  const h = (n:number)=> n.toString(16).padStart(2,'0');
  if (typeof a === 'number' && a >=0 && a < 1) {
    const ai = Math.round(a*255);
    return `#${h(r)}${h(g)}${h(b)}${h(ai)}`;
  }
  return `#${h(r)}${h(g)}${h(b)}`;
}

export function rgbToHsl({ r,g,b,a }:RGB): HSL {
  r/=255; g/=255; b/=255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h=0,s=0,l=(max+min)/2;
  if (max!==min) {
    const d = max-min;
    s = l>0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h = (g-b)/d + (g<b?6:0); break;
      case g: h = (b-r)/d + 2; break;
      default: h = (r-g)/d + 4; break;
    }
    h = h*60;
  }
  return { h: ((h%360)+360)%360, s: clamp(s), l: clamp(l), a };
}

export function hslToRgb({ h, s, l, a }: HSL): RGB {
  h = ((h%360)+360)%360; s=clamp(s); l=clamp(l);
  if (s===0) {
    const v = Math.round(l*255);
    return { r:v,g:v,b:v,a };
  }
  const q = l < 0.5 ? l*(1+s) : l + s - l*s;
  const p = 2*l - q;
  const hk = h/360;
  const t = [hk+1/3, hk, hk-1/3].map(tc=>{
    if (tc<0) tc+=1; if (tc>1) tc-=1;
    if (tc < 1/6) return p + (q-p)*6*tc;
    if (tc < 1/2) return q;
    if (tc < 2/3) return p + (q-p)*(2/3 - tc)*6;
    return p;
  });
  return { r: Math.round(t[0]*255), g: Math.round(t[1]*255), b: Math.round(t[2]*255), a };
}

function linearize(v:number){
  return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
}

export function relativeLuminance(color: string|RGB): number {
  const rgb = typeof color === 'string' ? parseColor(color) : color;
  const R = linearize(rgb.r/255), G = linearize(rgb.g/255), B = linearize(rgb.b/255);
  return 0.2126*R + 0.7152*G + 0.0722*B;
}

export function compositeOver(fg:RGB, bg:RGB): RGB {
  const af = typeof fg.a==='number'?fg.a:1;
  const ab = typeof bg.a==='number'?bg.a:1;
  const a = af + ab*(1-af);
  if (a===0) return { r:0,g:0,b:0,a:0 };
  const r = Math.round((fg.r*af + bg.r*ab*(1-af))/a);
  const g = Math.round((fg.g*af + bg.g*ab*(1-af))/a);
  const b = Math.round((fg.b*af + bg.b*ab*(1-af))/a);
  return { r,g,b,a };
}

export function contrastRatio(a:string|RGB, b:string|RGB): number {
  let A = typeof a==='string'?parseColor(a):a;
  let B = typeof b==='string'?parseColor(b):b;
  if (typeof A.a==='number' && A.a<1) A = compositeOver(A, B);
  if (typeof B.a==='number' && B.a<1) B = compositeOver(B, { r:255,g:255,b:255, a:1 });
  const LA = relativeLuminance(A);
  const LB = relativeLuminance(B);
  const L1 = Math.max(LA,LB), L2 = Math.min(LA,LB);
  return (L1 + 0.05) / (L2 + 0.05);
}

export function chooseBestTextColor(bgHex:string): string {
  return contrastRatio(bgHex, '#ffffff') >= contrastRatio(bgHex, '#000000') ? '#ffffff' : '#000000';
}

// adjust lightness only using binary search
export function adjustLightnessToTarget(fgHex:string, bgHex:string, target=4.5, maxIter=28) {
  const fg = parseColor(fgHex);
  const hsl = rgbToHsl(fg);
  const origL = hsl.l;
  const current = contrastRatio(fgHex, bgHex);
  if (current >= target) return { success:true, color:fgHex, contrast:current, adjusted:false };
  const test = (L:number) => {
    const rgb = hslToRgb({ h: hsl.h, s: hsl.s, l: clamp(L), a: fg.a });
    const hex = rgbToHex(rgb);
    return { hex, ratio: contrastRatio(hex, bgHex) };
  };
  const search = (low:number, high:number) => {
    let lo=low, hi=high, best:null|{L:number,hex:string,ratio:number}=null;
    for (let i=0;i<maxIter;i++){
      const mid=(lo+hi)/2;
      const {hex, ratio} = test(mid);
      if (ratio >= target) { best = { L:mid, hex, ratio }; if (origL < mid) hi = mid; else lo = mid; }
      else { if (origL < mid) lo = mid; else hi = mid; }
      if (Math.abs(hi-lo) < 1e-7) break;
    }
    return best;
  };
  const inc = search(origL, 1);
  const dec = search(origL, 0);
  const candidates = [inc, dec].filter(Boolean) as any[];
  if (candidates.length === 0) {
    const pick = contrastRatio('#000000', bgHex) > contrastRatio('#ffffff', bgHex) ? { color:'#000000', contrast: contrastRatio('#000000', bgHex) } : { color:'#ffffff', contrast: contrastRatio('#ffffff', bgHex) };
    return { success:false, color: pick.color, contrast: pick.contrast, adjusted:true, original: fgHex };
  }
  candidates.sort((a,b)=> Math.abs(a.L - origL) - Math.abs(b.L - origL));
  const chosen = candidates[0];
  return { success:true, color: chosen.hex, contrast: chosen.ratio, adjusted:true, original: fgHex };
}

export const transforms = {
  lighten: (hex:string, amt=0.1)=> { const rgb = parseColor(hex); const hsl = rgbToHsl(rgb); hsl.l = clamp(hsl.l + amt); return rgbToHex(hslToRgb(hsl)); },
  darken:  (hex:string, amt=0.1)=> { const rgb = parseColor(hex); const hsl = rgbToHsl(rgb); hsl.l = clamp(hsl.l - amt); return rgbToHex(hslToRgb(hsl)); },
  saturate:(hex:string, amt=0.1)=> { const rgb = parseColor(hex); const hsl = rgbToHsl(rgb); hsl.s = clamp(hsl.s + amt); return rgbToHex(hslToRgb(hsl)); },
  desaturate:(hex:string, amt=0.1)=> { const rgb = parseColor(hex); const hsl = rgbToHsl(rgb); hsl.s = clamp(hsl.s - amt); return rgbToHex(hslToRgb(hsl)); },
  rotateHue:(hex:string, deg=30)=> { const rgb = parseColor(hex); const hsl = rgbToHsl(rgb); hsl.h = (hsl.h + deg) % 360; return rgbToHex(hslToRgb(hsl)); }
};
