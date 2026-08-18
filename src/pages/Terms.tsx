import { LegalPage } from './LegalPage';
import { termsDocument } from '../constants/legal';

export function Terms() {
  return <LegalPage document={termsDocument} />;
}
