/**
 * Lista de municípios de uma UF, direto do IBGE.
 *
 * A lista muda por lei — municípios são criados, fundidos e renomeados — então
 * ela é buscada em vez de embutida: uma cópia no bundle envelheceria em silêncio,
 * e são 5.570 nomes que ninguém quer carregar de uma vez.
 *
 * O cache é do TanStack, por chave `['ibge','municipios',uf]` — antes havia um
 * Map aqui dentro fazendo o mesmo trabalho pior, sem repetição em caso de falha
 * e sem descartar o que ninguém mais usa.
 */
const ENDPOINT = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

interface IbgeMunicipality {
  nome: string;
}

export async function fetchCities(uf: string, signal?: AbortSignal): Promise<string[]> {
  const key = uf.toUpperCase();
  const response = await fetch(`${ENDPOINT}/${key}/municipios`, { signal });
  if (!response.ok) {
    throw new Error(`IBGE respondeu ${response.status}`);
  }

  const data = (await response.json()) as IbgeMunicipality[];
  return data.map((item) => item.nome).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}
