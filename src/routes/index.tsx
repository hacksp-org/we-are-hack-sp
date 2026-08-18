import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../layouts/Layout';
import { Home } from '../pages/Home';
import { Conduct } from '../pages/Conduct';
import { Terms } from '../pages/Terms';
import { EventPage } from '../pages/events/EventPage';
import { Join } from '../pages/Join';

/**
 * The redesign folded About, Hackathons, Transparency, Support and FAQ into the
 * home page as anchored sections, so those routes are gone — the footer and
 * header now link to `#sobre`, `#transparencia` and so on.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'conduct', element: <Conduct /> },
      { path: 'terms', element: <Terms /> },
      { path: ':eventId', element: <EventPage /> },
    ],
  },
  // Standalone: registration stands apart from the site, with no header or footer.
  { path: '/join', element: <Join /> },
]);
