const officialShortBio =
  'Dona de uma presença magnética, CHÊDA é DJ e seletora paranaense radicada em Florianópolis. Sua curadoria une House Music e Techno com técnica, carisma e identidade visual autoral.';

const bioPt =
  'Dona de uma presença magnética e de personalidade marcante, CHÊDA tem uma assinatura artística própria na música eletrônica.\n\n' +
  'DJ e seletora paranaense radicada em Florianópolis, se destaca por sua curadoria musical criteriosa, identidade visual autoral e capacidade de conduzir a pista com técnica e naturalidade.\n\n' +
  'Com um projeto iniciado em 2018, a artista desenvolve uma trajetória marcada pela pesquisa contínua e por oferecer além da música, um encontro de vibrações e troca de energia.\n\n' +
  'Suas seleções transitam entre diferentes vertentes da House Music e do Techno, combinando profundidade melódica, progressão e impacto, criando continuidade entre diferentes texturas e níveis de energia.\n\n' +
  'No palco, domínio técnico e carisma se traduzem em apresentações envolventes conduzidas com atenção à energia da pista e às respostas do público.';

export const siteContent = {
  identity: {
    stageName: 'CHÊDA',
    artistName: 'Patrícia Chêda',
    rolePt: 'DJ e seletora',
    roleEn: 'DJ and selector',
  },
  contact: {
    bookingEmail: 'booking@patriciacheda.com',
    bookingMailto: 'mailto:booking@patriciacheda.com',
    whatsappNumber: '5548992157396',
    whatsappMessage:
      'Olá, Patrícia! Gostaria de consultar sua disponibilidade para um evento.\n\n' +
      'Data: ___\n' +
      'Cidade: ___\n' +
      'Tipo de evento: ___',
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
    genres: ['house music', 'techno'],
    bioPt,
    tagline: 'som que invoca · cada set é um ritual',
  },
  pressKit: {
    title: 'CHÊDA · Patrícia Chêda · Press Kit A4',
    description:
      'Press kit A4 — CHÊDA / Patrícia Chêda. DJ e seletora paranaense radicada em Florianópolis. House Music e Techno, curadoria criteriosa, técnica e presença.',
    socialDescription:
      'DJ e seletora paranaense radicada em Florianópolis — House Music, Techno e presença de pista.',
    ogImage: '/assets/portrait-ritual.jpg',
    ogImageWidth: 1080,
    ogImageHeight: 1080,
    bioPt,
    bioEn:
      'DJ and selector from Paraná, based in Florianópolis, with a distinct artistic signature in electronic music. Her sets move through House Music and Techno with careful curation, technical command and magnetic presence.',
    bioEnCompact:
      'DJ and selector from Paraná, based in Florianópolis — House Music, Techno and magnetic presence.',
  },
} as const;
