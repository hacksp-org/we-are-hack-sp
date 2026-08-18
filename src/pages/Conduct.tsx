import { LegalPage } from './LegalPage';
import { conductDocument } from '../constants/legal';

export function Conduct() {
  return <LegalPage document={conductDocument} />;
}
