/**
 * optimizeTokens:
 * - tokens: Record<string, string> (e.g. { '--primary': '#3498db' })
 * - options: { contrastBase, target, generateScale }
 */
export declare function optimizeTokens(tokens: Record<string, string>, options?: {
    contrastBase?: string;
    target?: number;
    generateScale?: number;
}): Record<string, string | string[]>;
