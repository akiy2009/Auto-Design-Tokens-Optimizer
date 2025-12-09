// src/file-io.ts
import fs from 'fs';
import path from 'path';

export function readFileUtf8(p:string) {
  return fs.readFileSync(path.resolve(p),'utf8');
}
export function writeFileUtf8(p:string, data:string) {
  fs.writeFileSync(path.resolve(p), data, 'utf8');
}
export function isJSONFile(p:string) {
  return p.toLowerCase().endsWith('.json') || p.toLowerCase().endsWith('.tokens');
}
export function isCSSFile(p:string) {
  return p.toLowerCase().endsWith('.css') || p.toLowerCase().endsWith('.pcss');
}
