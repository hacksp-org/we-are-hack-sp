import { useQuery } from '@tanstack/react-query';
import { fetchEvents, type EventInfo } from '../constants/events';

interface Hackathons {
  upcoming: EventInfo[];
  past: EventInfo[];
  loading: boolean;
  failed: boolean;
}

/** Chave única do `events.json`: quem pedir por ela compartilha a mesma busca. */
export const EVENTS_QUERY_KEY = ['events'] as const;

/**
 * Os eventos, separados entre o que ainda vai acontecer e o que já aconteceu.
 *
 * Divide a consulta com o `useEvents` da home — antes cada um baixava o
 * `events.json` por conta própria, então ir da home para os hackathons pedia o
 * mesmo arquivo duas vezes.
 *
 * A ordem dos passados vem invertida em relação ao arquivo: o mais recente
 * primeiro é o que alguém quer ver ao abrir a página.
 */
export function useHackathons(): Hackathons {
  const { data, isPending, isError } = useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: fetchEvents,
  });

  const events = Object.values(data ?? {});

  return {
    upcoming: events.filter((event) => event.status === 'upcoming'),
    past: [...events.filter((event) => event.status === 'past')].reverse(),
    loading: isPending,
    failed: isError,
  };
}
