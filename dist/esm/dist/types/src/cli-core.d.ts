export interface CLIOptions {
    input: string;
    output?: string;
    target?: number;
    preset?: 'AA' | 'AAA';
    format?: 'css' | 'json';
    dryRun?: boolean;
    colorsOnly?: boolean;
    generateScale?: number;
    tokens?: Record<string, string>;
    verbose?: boolean;
}
export declare function runCLI(opts: CLIOptions): Promise<void>;
