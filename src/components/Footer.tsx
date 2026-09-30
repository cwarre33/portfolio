import { wiki } from '../data/wiki';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner mono">
        <span>© {new Date().getFullYear()} Cameron Warren</span>
        <span>
          metrics compiled from cameron-wiki · {wiki.totals.pages} pages · synced {wiki.generatedAt}
        </span>
        <span>press ⌘K</span>
      </div>
    </footer>
  );
}
