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

const sectionIds = sections.map((s) => s.id);

function App() {
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

export default App;
