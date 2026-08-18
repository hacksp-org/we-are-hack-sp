import drConsulta from '../assets/sponsors/dr-consulta.webp';
import imeUsp from '../assets/sponsors/ime-usp.png';
import taqtile from '../assets/sponsors/taqtile.png';
import hackclub from '../assets/sponsors/hackclub.png';

export interface Sponsor {
  src: string;
  alt: string;
}

export const sponsors: Sponsor[] = [
  { src: drConsulta, alt: 'Dr. Consulta' },
  { src: imeUsp, alt: 'IME-USP' },
  { src: taqtile, alt: 'Taqtile' },
  { src: hackclub, alt: 'Hack Club' },
];
