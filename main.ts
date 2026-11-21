// Garden of Differences — the hand-in assembler (Node 22, standard library only).
//
// It packs the entry into /output: the playable game under game/, the
// four screenshots under screenshots/, and dossier.json — the summary
// the judge reads — built by the vendored make.fun library.
//
// The grader executes this program twice and demands byte-identical
// output both times, so nothing here may depend on the clock, the
// network, or the order the filesystem returns entries: every listing
// is sorted, every copy is a plain byte copy, and the dossier is
// produced by the library from the packed tree.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The assembler measures the whole tree before it writes anything —
// the game folder, the entry point, every screenshot's size and
// dimensions, and the caps the scorer enforces — and fails loudly,
// naming the offending path, instead of handing in a broken layout.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// The scorer's own limits (the shared game gate's caps: dossier text is
// the only one that changes dossier bytes; the rest make this program
// fail exactly where the scorer would refuse the entry).
const LIMITS = {
  dossierTextMax: 163840,
  shotsMin: 3,
  shotsMax: 4,
  shotMaxBytes: 262144,
  shotLongSideMax: 1280,
  shotShortSideMin: 480,
  gameFilesMax: 993,
  gameBytesMax: 50331648,
  gamePathMax: 1000,
  outFilesMax: 1000,
  outBytesMax: 67108864,
};

function fail(why: string): never {
  throw new Error(`Garden of Differences hand-in failed: ${why}`);
}

function expectDir(path: string, what: string): void {
  if (!existsSync(path) || !statSync(path).isDirectory()) fail(`missing ${what} directory: ${path}`);
}

function expectFile(path: string, what: string): void {
  if (!existsSync(path) || !statSync(path).isFile()) fail(`missing ${what}: ${path}`);
}

/** Every file below a directory, as relative paths, in a stable order. */
function listTree(dir: string, prefix = ''): string[] {
  const found: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const entry of entries) {
    const rel = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...listTree(full, rel));
    else if (entry.isFile()) found.push(rel);
  }
  return found;
}

function totalBytes(dir: string, files: string[]): number {
  let sum = 0;
  for (const rel of files) sum += statSync(join(dir, rel)).size;
  return sum;
}

/** A PNG or JPEG's pixel size, read from its header (no decoder needed). */
function imageSize(path: string): { width: number; height: number } {
  const buf = readFileSync(path);
  if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let at = 2;
    while (at + 9 < buf.length) {
      if (buf[at] !== 0xff) break;
      const marker = buf[at + 1];
      const span = buf.readUInt16BE(at + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { width: buf.readUInt16BE(at + 7), height: buf.readUInt16BE(at + 5) };
      }
      at += 2 + span;
    }
  }
  fail(`unrecognized image format: ${path}`);
}

function validateShots(dir: string, files: string[]): void {
  if (files.length < LIMITS.shotsMin || files.length > LIMITS.shotsMax) {
    fail(`expected ${LIMITS.shotsMin} to ${LIMITS.shotsMax} screenshots, found ${files.length} in ${dir}`);
  }
  for (const rel of files) {
    const full = join(dir, rel);
    const size = statSync(full).size;
    if (size > LIMITS.shotMaxBytes) {
      fail(`screenshot over ${LIMITS.shotMaxBytes} bytes: ${full} (${size})`);
    }
    const { width, height } = imageSize(full);
    const long = Math.max(width, height);
    const short = Math.min(width, height);
    if (long > LIMITS.shotLongSideMax) {
      fail(`screenshot long side over ${LIMITS.shotLongSideMax}px: ${full} (${width}x${height})`);
    }
    if (short < LIMITS.shotShortSideMin) {
      fail(`screenshot short side under ${LIMITS.shotShortSideMin}px: ${full} (${width}x${height})`);
    }
  }
}

function copyTree(from: string, to: string, files: string[]): void {
  mkdirSync(to, { recursive: true });
  for (const rel of files) {
    const dest = join(to, rel);
    mkdirSync(join(dest, '..'), { recursive: true });
    cpSync(join(from, rel), dest);
  }
}

function assemble(): void {
  const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
  const gameDir = join(root, 'game');
  const shotsDir = join(root, 'screenshots');

  expectDir(gameDir, 'game');
  expectFile(join(gameDir, 'index.html'), 'game entry point');
  expectDir(shotsDir, 'screenshots');

  const gameFiles = listTree(gameDir);
  if (gameFiles.length === 0) fail(`no files under ${gameDir}`);
  if (gameFiles.length > LIMITS.gameFilesMax) {
    fail(`${gameFiles.length} files under game/ exceeds ${LIMITS.gameFilesMax}`);
  }
  const gameBytes = totalBytes(gameDir, gameFiles);
  if (gameBytes > LIMITS.gameBytesMax) {
    fail(`game/ is ${gameBytes} bytes, over ${LIMITS.gameBytesMax}`);
  }
  for (const rel of gameFiles) {
    if (Buffer.byteLength(join('game', rel), 'utf8') > LIMITS.gamePathMax) {
      fail(`game path too long: ${rel}`);
    }
  }

  const shotFiles = listTree(shotsDir);
  validateShots(shotsDir, shotFiles);

  copyTree(gameDir, join(outDir, 'game'), gameFiles);
  copyTree(shotsDir, join(outDir, 'screenshots'), shotFiles);

  const dossier = buildDossier(outDir, {
    text_max_bytes: LIMITS.dossierTextMax,
    screenshots: { max: LIMITS.shotsMax, max_bytes: LIMITS.shotMaxBytes },
    game_max_files: LIMITS.gameFilesMax,
    game_max_bytes: LIMITS.gameBytesMax,
    game_path_max_bytes: LIMITS.gamePathMax,
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);

  const outFiles = listTree(outDir);
  if (outFiles.length > LIMITS.outFilesMax) {
    fail(`/output has ${outFiles.length} files, over ${LIMITS.outFilesMax}`);
  }
  if (totalBytes(outDir, outFiles) > LIMITS.outBytesMax) fail('/output exceeds 64 MiB');
}

assemble();
