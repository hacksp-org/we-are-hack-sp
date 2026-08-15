import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../layouts/Layout';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Hackathons } from '../pages/Hackathons';
import { Transparency } from '../pages/Transparency';
import { Support } from '../pages/Support';
import { FAQ } from '../pages/FAQ';
import { EventPage } from '../pages/events/EventPage';
import { Join } from '../pages/Join';
import { Unsubscribe } from '../pages/Unsubscribe';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'hackathons',
        element: <Hackathons />,
      },
      {
        path: 'transparency',
        element: <Transparency />,
      },
      {
        path: 'support',
        element: <Support />,
      },
      {
        path: 'faq',
        element: <FAQ />,
      },
      {
        path: 'unsubscribe',
        element: <Unsubscribe />,
      },
      {
        path: ':eventId',
        element: <EventPage />,
      },
    ],
  },
  // Standalone page: no header or footer, so registration stands apart from the site.
  {
    path: '/join',
    element: <Join />,
  },
]);
