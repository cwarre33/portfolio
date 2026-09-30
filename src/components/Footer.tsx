import { wiki } from '../data/wiki';
import { shortcutLabel } from '../hooks/platform';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner mono">
        <span>© {new Date().getFullYear()} Cameron Warren</span>
        <span>
          metrics compiled from cameron-wiki · {wiki.totals.pages} pages · synced {wiki.generatedAt}
        </span>
        <span className="footer__kbd">press {shortcutLabel}</span>
      </div>
    </footer>
  );
}
