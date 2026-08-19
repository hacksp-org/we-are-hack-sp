import { useEffect, useState } from 'react';
import { fetchEvents, type EventInfo } from '../constants/events';

interface Hackathons {
  upcoming: EventInfo[];
  past: EventInfo[];
  loading: boolean;
  failed: boolean;
}

/**
 * Os eventos, separados entre o que ainda vai acontecer e o que já aconteceu.
 *
 * Diferente do `useEvents`, que reduz tudo a um cartão para a home, aqui o
 * evento inteiro é preservado: a página de hackathons mostra estatísticas,
 * fotos e links que o cartão descarta.
 *
 * A ordem dos passados vem invertida em relação ao arquivo — o mais recente
 * primeiro é o que alguém quer ver ao abrir a página.
 */
export function useHackathons(): Hackathons {
  const [events, setEvents] = useState<EventInfo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    fetchEvents()
      .then((map) => {
        if (active) setEvents(Object.values(map));
      })
      .catch(() => {
        if (active) {
          setEvents([]);
          setFailed(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    upcoming: events?.filter((event) => event.status === 'upcoming') ?? [],
    past: [...(events?.filter((event) => event.status === 'past') ?? [])].reverse(),
    loading: events === null,
    failed,
  };
}
