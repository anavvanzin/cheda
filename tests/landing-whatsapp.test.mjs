import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('promotes WhatsApp as the primary booking path with a prefilled brief', async () => {
  const site = await readFile('src/data/site.ts', 'utf8');
  const component = await readFile('src/components/LandingBody.astro', 'utf8');

  assert.match(site, /whatsappNumber:\s*'5548992157396'/);
  assert.match(site, /whatsappMessage:[\s\S]*?Olá, Patrícia![\s\S]*?Data: ___[\s\S]*?Cidade: ___[\s\S]*?Tipo de evento: ___/);
  assert.match(
    component,
    /const whatsappHref = `https:\/\/wa\.me\/\$\{siteContent\.contact\.whatsappNumber\}\?text=\$\{encodeURIComponent\(siteContent\.contact\.whatsappMessage\)\}`/,
  );
  assert.equal((component.match(/href=\{whatsappHref\}/g) ?? []).length, 2);
  assert.match(
    component,
    /class="button button-primary booking-whatsapp hero-booking"[\s\S]*?target="_blank"[\s\S]*?rel="noopener"[\s\S]*?aria-label="Consultar disponibilidade pelo WhatsApp"/,
  );
  assert.match(component, /class="booking-email" href=\{bookingHref\}/);
});

test('keeps the WhatsApp treatment subtle, responsive, and motion-safe', async () => {
  const component = await readFile('src/components/LandingBody.astro', 'utf8');
  const landing = await readFile('src/styles/landing.css', 'utf8');

  assert.match(component, /class="whatsapp-mark" aria-hidden="true"/);
  assert.match(component, /class="whatsapp-pulse"/);
  assert.match(component, /class="booking-label-default"/);
  assert.match(component, /class="booking-label-hover" aria-hidden="true"/);
  assert.match(landing, /\.whatsapp-pulse\s*\{[\s\S]*?background:\s*#25d366/);
  assert.match(landing, /@keyframes whatsapp-pulse/);
  assert.match(landing, /\.booking-whatsapp:is\(:hover, :focus-visible\)[\s\S]*?\.booking-label-default/);
  assert.match(landing, /@media \(max-width: 720px\)[\s\S]*?\.booking-label-hover\s*\{\s*display:\s*none/);
  assert.match(landing, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.whatsapp-pulse[\s\S]*?animation:\s*none\s*!important/);
});
