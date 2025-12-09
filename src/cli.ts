#!/usr/bin/env node
// src/cli.ts
import { runCLI } from './cli-core';
import { readFileUtf8 } from './file-io';
import fs from 'fs';
import path from 'path';

function printHelp() {
  console.log(`adt-optimize — Design Token Auto Optimizer CLI

Usage:
  adt-optimize --input <file> [options]

Options:
  --input <file>         Input file (.json tokens or .css)
  --output <file>        Output file (optional)
  --format <css|json>    Output format when input is JSON (default json)
  --target <number>      Target contrast (e.g. 4.5 or 7)
  --preset <AA|AAA>      Preset for contrast (AA=4.5, AAA=7)
  --dry-run              Print output to stdout
  --generate-scale <n>   When input is tokens, generate n-step scale per token
  --colors-only          Only process color tokens (ignored for CSS input)
  --verbose              Verbose logs
  --help                 Show this help
`);
}

function parseArgs(argv:string[]) {
  const out:any = {};
  for (let i=0;i<argv.length;i++){
    const a = argv[i];
    if (a === '--input') out.input = argv[++i];
    else if (a === '--output') out.output = argv[++i];
    else if (a === '--format') out.format = argv[++i];
    else if (a === '--target') out.target = parseFloat(argv[++i]);
    else if (a === '--preset') out.preset = argv[++i];
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--generate-scale') out.generateScale = parseInt(argv[++i],10);
    else if (a === '--colors-only') out.colorsOnly = true;
    else if (a === '--verbose') out.verbose = true;
    else if (a === '--help' || a === '-h') out.help = true;
    else {
      // skip unknown
    }
  }
  return out;
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (!args.input || args.help) {
      printHelp();
      process.exit(args.help ? 0 : 1);
    }
    await runCLI({
      input: args.input,
      output: args.output,
      format: args.format,
      target: args.target,
      preset: args.preset,
      dryRun: args.dryRun,
      colorsOnly: args.colorsOnly,
      generateScale: args.generateScale,
      verbose: args.verbose,
      tokens: undefined
    });
  } catch (e:any) {
    console.error('Error:', e.message || e);
    process.exit(2);
  }
}

if (require.main === module) {
  main();
}
