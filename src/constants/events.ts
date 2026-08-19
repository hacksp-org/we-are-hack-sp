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
    pt: {
      date: string;
      location: string;
      description: string;
      locationDescription?: string;
    };
    en: {
      date: string;
      location: string;
      description: string;
      locationDescription?: string;
    };
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