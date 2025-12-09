export declare function normalizeTokenColor(hex: string, opts?: {
    contrastBase?: string;
    target?: number;
}): any;
export declare function generateTokenScale(baseHex: string, steps?: number): string[];
export declare function validateTokens(tokens: Record<string, string>, opts?: {
    contrastBase?: string;
    target?: number;
}): Record<string, {
    ok: boolean;
    contrast: number;
}>;
