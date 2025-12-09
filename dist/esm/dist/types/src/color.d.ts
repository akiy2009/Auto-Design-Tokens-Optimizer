export type RGB = {
    r: number;
    g: number;
    b: number;
    a?: number;
};
export type HSL = {
    h: number;
    s: number;
    l: number;
    a?: number;
};
/** parseColor: hex / #rgb / #rrggbb / #rrggbbaa / rgb()/rgba()/hsl()/hsla() */
export declare function parseColor(input: string): RGB;
export declare function rgbToHex({ r, g, b, a }: RGB): string;
export declare function rgbToHsl({ r, g, b, a }: RGB): HSL;
export declare function hslToRgb({ h, s, l, a }: HSL): RGB;
export declare function relativeLuminance(color: string | RGB): number;
export declare function compositeOver(fg: RGB, bg: RGB): RGB;
export declare function contrastRatio(a: string | RGB, b: string | RGB): number;
export declare function chooseBestTextColor(bgHex: string): string;
export declare function adjustLightnessToTarget(fgHex: string, bgHex: string, target?: number, maxIter?: number): {
    success: boolean;
    color: string;
    contrast: number;
    adjusted: boolean;
    original?: undefined;
} | {
    success: boolean;
    color: any;
    contrast: any;
    adjusted: boolean;
    original: string;
};
export declare const transforms: {
    lighten: (hex: string, amt?: number) => string;
    darken: (hex: string, amt?: number) => string;
    saturate: (hex: string, amt?: number) => string;
    desaturate: (hex: string, amt?: number) => string;
    rotateHue: (hex: string, deg?: number) => string;
};
