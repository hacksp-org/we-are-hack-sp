import { LegalPage } from './LegalPage';
import { termsBlocks } from '../constants/legal';

export function Terms() {
  return <LegalPage blocks={termsBlocks} />;
}
