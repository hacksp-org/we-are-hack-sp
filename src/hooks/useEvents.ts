import { useEffect, useState } from 'react';
import { fetchEvents, type EventInfo } from '../constants/events';
import daydreamFallback from '../assets/events/daydream-fallback.webp';
import drxFallback from '../assets/events/drx-fallback.webp';

export interface EventCard {
  id: string;
  name: string;
  image: string;
  meta: { pt: string; en: string };
  description: { pt: string; en: string };
}

/**
 * Events live in a public repository, so the network can fail without the page
 * being broken. When it does, these two stand in — the section is part of the
 * story we tell, and an empty gap would read worse than a static list.
 */
const FALLBACK: EventCard[] = [
  {
    id: 'daydream-sp',
    name: 'Daydream SP',
    image: daydreamFallback,
    meta: { pt: '', en: '' },
    description: {
      pt: 'Um dia de imersão, times formados na hora e demonstrações no final.',
      en: 'A day of immersion, teams and final demos.',
    },
  },
  {
    id: 'drx-hacksp',
    name: 'DRX Hack SP',
    image: drxFallback,
    meta: { pt: '', en: '' },
    description: {
      pt: 'Estudantes construindo projetos do zero com mentores presentes.',
      en: 'Students building projects from scratch with mentors on site.',
    },
  },
];

const toCard = (event: EventInfo): EventCard => ({
  id: event.id,
  name: event.name,
  image: event.bannerUrl ?? event.photos[0] ?? daydreamFallback,
  meta: {
    pt: [event.translations.pt.date, event.translations.pt.location].filter(Boolean).join(' · '),
    en: [event.translations.en.date, event.translations.en.location].filter(Boolean).join(' · '),
  },
  description: {
    pt: event.translations.pt.description,
    en: event.translations.en.description,
  },
});

interface HomeEvents {
  /** Os que já aconteceram, como cartão, para a faixa do histórico. */
  cards: EventCard[];
  /** O próximo, inteiro, para o destaque no topo da home. */
  upcoming: EventInfo | null;
  loading: boolean;
}

/**
 * Os eventos da home, separados pelo papel que cada um cumpre na página.
 *
 * A faixa do histórico se chama "o que já fizemos" e carimbava cada cartão com
 * "Evento passado" — mas a lista vinha sem filtro de `status`, então o próximo
 * evento apareceria lá dentro, anunciado como coisa que já aconteceu. Separar
 * aqui mantém o carimbo verdadeiro em vez de removê-lo da tela.
 *
 * Os dois saem da mesma requisição de propósito: a home já busca este arquivo
 * uma vez, e um segundo `fetch` do mesmo JSON para achar o destaque sairia
 * caro à toa.
 */
export function useEvents(): HomeEvents {
  const [events, setEvents] = useState<EventInfo[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchEvents()
      .then((map) => {
        if (active) setEvents(Object.values(map));
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const past = events?.filter((event) => event.status === 'past').map(toCard) ?? [];

  return {
    cards: failed || (events !== null && past.length === 0) ? FALLBACK : past,
    // O arquivo é editado à mão; se dois forem marcados como próximos, o
    // destaque é do primeiro em vez da página escolher sozinha.
    upcoming: events?.find((event) => event.status === 'upcoming') ?? null,
    loading,
  };
}
