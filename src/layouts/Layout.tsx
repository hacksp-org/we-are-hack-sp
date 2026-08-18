import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

/**
 * No page padding here: the redesign is built from full-bleed sections that set
 * their own background and rules, so each one owns its horizontal gutter.
 */
export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
