import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../layouts/Layout';
import { Home } from '../pages/Home';
import { Conduct } from '../pages/Conduct';
import { Terms } from '../pages/Terms';
import { Join } from '../pages/Join';

/**
 * The redesign is one page plus two documents. About, Hackathons,
 * Transparency, Support, FAQ and the per-event pages are gone — their content
 * either became an anchored section of the home page or was dropped, so the
 * header and footer link to `#sobre`, `#transparencia` and so on.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'conduct', element: <Conduct /> },
      { path: 'terms', element: <Terms /> },
    ],
  },
  // Standalone: registration stands apart, with no header or footer.
  { path: '/join', element: <Join /> },
]);
