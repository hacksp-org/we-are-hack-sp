/**
 * O conteúdo de uma página de evento que não cabe no cartão: programação,
 * para quem é, perguntas frequentes. Tudo opcional — a página mostra só as
 * seções que o `events.json` preencher, então um evento novo ganha página
 * com o mínimo (nome, data, local, descrição) e vai engordando pelo arquivo,
 * sem deploy do site.
 */
export interface EventDetails {
  about?: string[];
  audience?: string;
  schedule?: { time: string; title: string; description?: string }[];
  faq?: { question: string; answer: string }[];
}

interface EventCopy {
  date: string;
  location: string;
  description: string;
  locationDescription?: string;
  details?: EventDetails;
}

export interface EventInfo {
  id: string;
  status: 'upcoming' | 'past';
  name: string;
  videoUrl?: string;
  websiteUrl?: string;
  registrationUrl?: string;
  bannerUrl?: string;
  googleMapsUrl?: string;
  translations: {
    pt: EventCopy;
    en: EventCopy;
  };
  stats?: {
    participants: string;
    projects: string;
    duration: string;
  };
  photos: string[];
  locationPhotos?: string[];
}

export type EventsMap = Record<string, EventInfo>;

/**
 * O arquivo tem duas chaves por evento — a do objeto (`daydream`) e o `id`
 * dentro dele (`daydream-sp`) — e elas nem sempre coincidem. A URL aceita
 * qualquer uma das duas, para nenhum link já divulgado quebrar.
 */
export function findEvent(map: EventsMap, slug: string): EventInfo | null {
  return map[slug] ?? Object.values(map).find((event) => event.id === slug) ?? null;
}

/**
 * Os eventos são conteúdo dinâmico e vivem no repositório `events`, fora do CDN
 * de assets. O `raw.githubusercontent.com` responde com `max-age=300` e ETag, o
 * que já dá cache de navegador e revalidação barata depois disso.
 *
 * O `?v=${Date.now()}` que existia aqui tornava cada requisição uma URL nova, e
 * com isso jogava fora os dois: todo visitante rebaixava o arquivo inteiro a
 * cada carregamento de página.
 */
const EVENTS_URL = 'https://raw.githubusercontent.com/hacksp-org/events/main/events.json';

export async function fetchEvents(): Promise<EventsMap> {
  const response = await fetch(EVENTS_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
  }

  return response.json();
}