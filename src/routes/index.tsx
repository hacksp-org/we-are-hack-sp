import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../layouts/Layout';
import { Home } from '../pages/Home';
import { Conduct } from '../pages/Conduct';
import { Terms } from '../pages/Terms';
import { Join } from '../pages/Join';
import Volunteer from '../pages/Volunteer';

/**
 * The redesign is one page plus three documents. About, Hackathons,
 * Transparency, Support, FAQ and the per-event pages are gone — their content
 * either became an anchored section of the home page or was dropped.
 *
 * Registration sits inside the layout now: the redesign gives it the same
 * header and footer, so there is always a way back to the site from it.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'join', element: <Join /> },
      { path: 'conduct', element: <Conduct /> },
      { path: 'terms', element: <Terms /> },
      { path: 'volunteer', element: <Volunteer /> },
    ],
  },
]);
