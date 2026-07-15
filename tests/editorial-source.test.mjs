import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const sourcePath = 'src/data/site.ts';
const consumerPaths = [
  'src/layouts/Base.astro',
  'src/components/LandingBody.astro',
  'src/components/PressKitBody.astro',
  'src/pages/press-kit.astro',
  'src/components/PrintPosterBody.astro',
  'src/components/PrintMorphBody.astro',
];

const source = await readFile(sourcePath, 'utf8').catch(() => '');
const consumers = new Map(
  await Promise.all(
    consumerPaths.map(async (path) => [path, await readFile(path, 'utf8')]),
  ),
);
const publicSource = [...consumers.values()].join('\n');

const officialBio =
  'Patrícia Chêda — DJ e selectora — atravessa techno, tech house e noise com estética de xilogravura e serigrafia. Sem playlist fixa — leitura de pista em tempo real, camadas que crescem sem pressa. Som que invoca: cada set é um ritual, não uma playlist.';

const canonicalLiterals = [
  'https://patriciacheda.com',
  'CHÊDA',
  'Patrícia Chêda',
  'patriciavchedach@gmail.com',
  'mailto:patriciavchedach@gmail.com',
  '@patriciacheda_',
  'https://www.instagram.com/patriciacheda_/',
  'https://soundcloud.com/patriciacheda',
  'Florianópolis',
  'SC',
  'Brasil',
  'Florianópolis · SC',
  'Floripa',
  'DJ e selectora',
  'DJ and selector',
  'techno',
  'tech house',
  'noise',
  'Uma apresentação que transforma música em movimento e movimento em unidade. No meu projeto de DJ, ofereço mais do que música: um encontro de vibrações, uma troca de energia. O que sentimos juntos não é apenas ritmo — é pulsação. Aqui, cada batida ecoa o pulsar da própria vida.',
  'som que invoca · cada set é um ritual',
  officialBio,
];

test('site.ts owns every approved editorial literal', () => {
  assert.notEqual(source, '', `${sourcePath} must exist`);
  for (const literal of canonicalLiterals) {
    assert.ok(source.includes(literal), `${sourcePath} must contain ${literal}`);
  }
  assert.match(source, /export const siteContent\s*=\s*\{/);
  assert.match(source, /}\s+as const;/);
});

test('consumers import approved facts instead of owning contact URLs or the official bio', () => {
  for (const [path, contents] of consumers) {
    assert.match(contents, /from ['"]\.\.\/(?:\.\.\/)?data\/site['"]|from ['"]\.\.\/data\/site['"]/, `${path} must import site.ts`);
    assert.ok(!contents.includes(officialBio), `${path} duplicates the official bio`);
  }

  for (const duplicatedContact of [
    'patriciavchedach@gmail.com',
    'instagram.com/patriciacheda_',
    'soundcloud.com/patriciacheda',
  ]) {
    assert.ok(
      !publicSource.includes(duplicatedContact),
      `consumer source duplicates ${duplicatedContact}`,
    );
  }
});

test('public source rejects retired identity, invented sets, and private planning copy', () => {
  const forbiddenPatterns = [
    /\bCHDX\b/,
    /\bCHEDA\b/,
    /DJ e seletora/i,
    /Ritual Noturno/i,
    /Pista Aberta/i,
    /(?:fake|placeholder|example)[\w.+-]*@[\w.-]+/i,
    /(?:waiting on real|to be replaced|placeholder|mirrors main cleanup)/i,
    /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i,
  ];

  const allPublicSource = `${source}\n${publicSource}`;
  for (const pattern of forbiddenPatterns) {
    assert.doesNotMatch(allPublicSource, pattern);
  }
});
