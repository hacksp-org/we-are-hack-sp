/**
 * Origem única dos assets estáticos da marca.
 *
 * Eles vivem no `cdn.hacksp.org` (R2 atrás da Cloudflare) em vez de entrarem no
 * bundle: são os mesmos arquivos em todos os sites do Hack SP, então servi-los de
 * um lugar só evita quatro cópias divergindo com o tempo, e a Cloudflare os
 * entrega do edge com cache longo — o build deixa de crescer a cada logo.
 *
 * Fotos de evento não passam por aqui: elas são dinâmicas e vêm do repositório
 * `events`.
 */
const CDN_URL = import.meta.env.VITE_CDN_URL || 'https://cdn.hacksp.org';

export function cdn(path: string): string {
  return `${CDN_URL}/${path.replace(/^\/+/, '')}`;
}

export const brand = {
  markRed: cdn('brand/marks/brand-mark-red.png'),
  markWhite: cdn('brand/marks/brand-mark-white.png'),
  logoHorizontalWhite: cdn('brand/logos/logo-horizontal-white-red.png'),
  logoHorizontalBlack: cdn('brand/logos/logo-horizontal-black-red.png'),
  /** Bandeira do Hack Club, no rodapé — a arte é a mesma do logo de patrocinador. */
  hackclubFlag: cdn('sponsors/hackclub-white.png'),
} as const;
