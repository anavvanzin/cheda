import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const sourcePath = 'src/data/site.ts';
const consumerPaths = [
  'src/layouts/Base.astro',
  'src/components/LandingBody.astro',
  'src/components/PressKitBody.astro',
  'src/pages/press-kit.astro',
  'src/components/PrintPosterBody.astro',
  'src/components/PrintMorphBody.astro',
];

async function collectPublicTextFiles(directory, extensions) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectPublicTextFiles(path, extensions);
    return extensions.has(extname(entry.name)) ? [path] : [];
  }));
  return paths.flat();
}

const source = await readFile(sourcePath, 'utf8').catch(() => '');
const publicPaths = [
  ...await collectPublicTextFiles('src', new Set(['.astro', '.ts', '.js'])),
  ...await collectPublicTextFiles('public', new Set(['.js'])),
].filter((path) => path !== sourcePath);
const publicFiles = new Map(
  await Promise.all(
    publicPaths.map(async (path) => [path, await readFile(path, 'utf8')]),
  ),
);
const consumers = new Map(
  consumerPaths.map((path) => [path, publicFiles.get(path)]),
);

const officialBio =
  'Patrícia Chêda — DJ e selectora — atravessa techno, tech house e noise com estética de xilogravura e serigrafia. Sem playlist fixa — leitura de pista em tempo real, camadas que crescem sem pressa. Som que invoca: cada set é um ritual, não uma playlist.';

const expectedContent = {
  identity: {
    stageName: 'CHÊDA',
    artistName: 'Patrícia Chêda',
    rolePt: 'DJ e selectora',
    roleEn: 'DJ and selector',
  },
  contact: {
    bookingEmail: 'patriciavchedach@gmail.com',
    bookingMailto: 'mailto:patriciavchedach@gmail.com',
    instagramHandle: '@patriciacheda_',
    instagramUrl: 'https://www.instagram.com/patriciacheda_/',
    soundcloudUrl: 'https://soundcloud.com/patriciacheda',
  },
  location: {
    city: 'Florianópolis',
    state: 'SC',
    country: 'Brasil',
    countryCode: 'BR',
    displayPt: 'Florianópolis · SC · Brasil',
    displayShort: 'Floripa',
  },
  site: {
    canonicalUrl: 'https://patriciacheda.com',
    defaultTitle: 'CHÊDA · Patrícia Chêda',
    defaultDescription: officialBio,
    ogImage: 'https://patriciacheda.com/assets/favicon/og-image.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
  editorial: {
    officialShortBio: officialBio,
    manifesto:
      'Uma apresentação que transforma música em movimento e movimento em unidade. No meu projeto de DJ, ofereço mais do que música: um encontro de vibrações, uma troca de energia. O que sentimos juntos não é apenas ritmo — é pulsação. Aqui, cada batida ecoa o pulsar da própria vida.',
    genres: ['techno', 'tech house', 'noise'],
    tagline: 'som que invoca · cada set é um ritual',
  },
  pressKit: {
    title: 'CHÊDA · Patrícia Chêda · Press Kit A4',
    description:
      'Press kit A4 — CHÊDA / Patrícia Chêda. DJ e selectora de techno denso e hipnótico, Florianópolis. Som que invoca: cada set é um ritual, não uma playlist.',
    socialDescription:
      'DJ e selectora de techno denso e hipnótico — Florianópolis, BR. Som que invoca.',
    ogImage: '/assets/portrait-ritual.jpg',
    ogImageWidth: 1080,
    ogImageHeight: 1080,
    bioPt:
      'Patrícia Chêda é DJ e selectora radicada em Florianópolis. Sets de techno densos e hipnóticos — ruído, groove e tensão em camadas que crescem sem pressa.',
    bioEn:
      'DJ and selector based in Florianópolis, Brazil. Dense, hypnotic techno — noise, groove and tension layered with patience. Every set a ritual.',
    bioEnCompact:
      'DJ and selector based in Florianópolis, Brazil. Dense, hypnotic techno — every set a ritual, not a playlist.',
  },
};

function evaluateSiteContent(contents) {
  const executable = contents
    .replace('export const siteContent', 'const siteContent')
    .replace(/}\s+as const;\s*$/, '};');
  const serialized = runInNewContext(
    `${executable}\nJSON.stringify(siteContent);`,
    { JSON },
  );
  return JSON.parse(serialized);
}

test('site.ts binds every approved value to its canonical section and property', () => {
  assert.notEqual(source, '', `${sourcePath} must exist`);
  assert.match(source, /export const siteContent\s*=\s*\{/);
  assert.match(source, /}\s+as const;/);
  assert.deepEqual(evaluateSiteContent(source), expectedContent);
  assert.equal(
    source.split(officialBio).length - 1,
    1,
    'the official bio literal must have one definition in site.ts',
  );
});

test('consumers import approved facts instead of owning editorial phrases', () => {
  for (const [path, contents] of consumers) {
    assert.match(contents, /from ['"]\.\.\/(?:\.\.\/)?data\/site['"]|from ['"]\.\.\/data\/site['"]/, `${path} must import site.ts`);
    assert.ok(!contents.includes(officialBio), `${path} duplicates the official bio`);
  }

  const independentFacts = new Map([
    ['src/components/LandingBody.astro', [
      'DJ · Techno · Tech House · Noise · Floripa',
      'Patrícia Chêda — retrato editorial',
    ]],
    ['src/components/PressKitBody.astro', [
      'Florianópolis · BR',
      'som que invoca — Florianópolis, BR',
      'Patrícia Chêda — retrato editorial',
      'alt="Patrícia Chêda"',
    ]],
    ['src/components/PrintPosterBody.astro', [
      'DJ · Techno · Tech House · Noise · Floripa',
      'Patrícia Chêda — retrato editorial',
    ]],
    ['src/components/PrintMorphBody.astro', [
      'DJ · Techno · Tech House · Noise · Floripa',
      'Patrícia Chêda — retrato editorial',
    ]],
  ]);

  for (const [path, facts] of independentFacts) {
    for (const fact of facts) {
      assert.ok(!publicFiles.get(path).includes(fact), `${path} owns ${fact}`);
    }
  }

  for (const duplicatedContact of [
    'patriciavchedach@gmail.com',
    'instagram.com/patriciacheda_',
    'soundcloud.com/patriciacheda',
  ]) {
    for (const [path, contents] of publicFiles) {
      assert.ok(!contents.includes(duplicatedContact), `${path} duplicates ${duplicatedContact}`);
    }
  }
});

const fakeSetTitlePattern = /(?:(?:setTitle|trackTitle)\s*[:=]\s*['"]Som que Invoca['"]|<([a-z][\w-]*)\b(?=[^>]*\bclass=['"](?:[^'"]*\s)?(?:set|track)(?:-(?:card|title|item))?(?=\s|['"])[^'"]*['"])[^>]*>(?:(?!<\/\1\s*>)[\s\S])*?Som que Invoca(?:(?!<\/\1\s*>)[\s\S])*?<\/\1\s*>)/i;

test('fake set title detection is semantic and bounded to its card', () => {
  const approvedManifesto = '<div class="asset-card"></div><p>Som que Invoca</p>';
  const closedSetCard = '<div class="set-card"></div><p>Som que Invoca</p>';
  const inventedSetCard = '<article class="set-card"><h3>Som que Invoca</h3></article>';

  assert.doesNotMatch(approvedManifesto, fakeSetTitlePattern);
  assert.doesNotMatch(closedSetCard, fakeSetTitlePattern);
  assert.match(inventedSetCard, fakeSetTitlePattern);
});

test('all public textual source rejects retired, invented, private, and local-only copy', () => {
  const forbiddenPatterns = [
    /\bCHDX\b/,
    /\bCHEDA\b/,
    /DJ e seletora/i,
    /Ritual Noturno/i,
    /Pista Aberta/i,
    /\b(?:58|62|74)\s*min\b/i,
    /\b(?:[\w.+-]*(?:placeholder|example)[\w.+-]*@[\w.-]+|[\w.+-]+@example\.(?:com|org|net))\b/i,
    /(?:waiting on real|to be replaced|mirrors main cleanup|private copy|planner copy)/i,
    /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i,
  ];

  // “Som que Invoca” is approved manifesto/tagline language. It is forbidden
  // only when assigned to a set/track title or rendered inside a set/track card.
  for (const [path, contents] of publicFiles) {
    for (const pattern of forbiddenPatterns) {
      assert.doesNotMatch(contents, pattern, `${path} matches ${pattern}`);
    }
    assert.doesNotMatch(contents, fakeSetTitlePattern, `${path} uses Som que Invoca as a fake set title`);
  }
});
