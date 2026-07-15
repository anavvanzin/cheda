const officialShortBio =
  'Patrícia Chêda — DJ e selectora — atravessa techno, tech house e noise com estética de xilogravura e serigrafia. Sem playlist fixa — leitura de pista em tempo real, camadas que crescem sem pressa. Som que invoca: cada set é um ritual, não uma playlist.';

export const siteContent = {
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
    defaultDescription: officialShortBio,
    ogImage: 'https://patriciacheda.com/assets/favicon/og-image.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
  editorial: {
    officialShortBio,
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
} as const;
