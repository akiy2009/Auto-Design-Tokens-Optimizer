export interface PluginOptions {
    tokens?: Record<string, string>;
    defaultContrastBase?: string;
    defaultContrastTarget?: number;
    tokenPrefix?: string;
}
export default function plugin(opts?: PluginOptions): {
    postcssPlugin: string;
    Root(root: any): void;
    Declaration(decl: any): void;
};
