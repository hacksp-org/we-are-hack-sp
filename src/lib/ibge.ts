/**
 * Lista de municípios de uma UF, direto do IBGE.
 *
 * A lista muda por lei — municípios são criados, fundidos e renomeados — então
 * ela é buscada em vez de embutida: uma cópia no bundle envelheceria em silêncio,
 * e são 5.570 nomes que ninguém quer carregar de uma vez.
 *
 * O cache é por UF e vive enquanto a aba estiver aberta: quem troca de estado e
 * volta não paga a viagem de novo.
 */
const ENDPOINT = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

const cache = new Map<string, string[]>();

interface IbgeMunicipality {
  nome: string;
}

export async function fetchCities(uf: string, signal?: AbortSignal): Promise<string[]> {
  const key = uf.toUpperCase();
  const cached = cache.get(key);
  if (cached) return cached;

  const response = await fetch(`${ENDPOINT}/${key}/municipios`, { signal });
  if (!response.ok) {
    throw new Error(`IBGE respondeu ${response.status}`);
  }

  const data = (await response.json()) as IbgeMunicipality[];
  const names = data
    .map((item) => item.nome)
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));

  cache.set(key, names);
  return names;
}
