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

export function useEvents() {
  const [cards, setCards] = useState<EventCard[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchEvents()
      .then((map) => {
        if (!active) return;
        const list = Object.values(map).map(toCard);
        setCards(list.length > 0 ? list : FALLBACK);
      })
      .catch(() => {
        if (active) setCards(FALLBACK);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { cards: cards ?? [], loading };
}
