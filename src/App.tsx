import { Suspense, lazy, useEffect, useState } from 'react';
import { SectionTracker } from './analytics/SectionTracker';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Impact } from './components/Impact';
import { Systems } from './components/Systems';
import { Decisions } from './components/Decisions';
import { Arena } from './components/Arena';
import { Brain } from './components/Brain';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { sections } from './components/links';
import { useRevealOnScroll } from './hooks/motion';

// Private cockpit: code-split so it never loads unless someone opens #/ops.
// Its data is fetched at runtime from a private repo; nothing private ships here.
const OpsApp = lazy(() => import('./ops/OpsApp'));

const sectionIds = sections.map((s) => s.id);
const OPS_HASH = '#/ops';

function Site() {
  useRevealOnScroll();
  return (
    <>
      <SectionTracker sectionIds={sectionIds} />
      <div className="grain" aria-hidden="true" />
      <Header />
      <main id="top">
        <Hero />
        <Impact />
        <Systems />
        <Decisions />
        <Arena />
        <Brain />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [ops, setOps] = useState(() => window.location.hash === OPS_HASH);
  useEffect(() => {
    const on = () => setOps(window.location.hash === OPS_HASH);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  if (ops) {
    return (
      <Suspense fallback={<div className="ops" />}>
        <OpsApp />
      </Suspense>
    );
  }
  return <Site />;
}

export default App;
