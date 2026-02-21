import { useState, useEffect, useRef } from 'react';
import { rotatingTitles } from '../data/skills';

const TYPING_SPEED = 80;
const PAUSE_AT_END = 2200;
const DELETE_SPEED = 45;
const PAUSE_AFTER_DELETE = 400;

export function Typewriter() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(0);

  useEffect(() => {
    const target = rotatingTitles[index];

    const tick = () => {
      if (!isDeleting) {
        if (text.length < target.length) {
          setText(target.slice(0, text.length + 1));
          timeoutRef.current = setTimeout(tick, TYPING_SPEED);
        } else {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), PAUSE_AT_END);
        }
        return;
      }

      if (text.length > 0) {
        setText(text.slice(0, -1));
        timeoutRef.current = setTimeout(tick, DELETE_SPEED);
      } else {
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(false);
          setIndex((i) => (i + 1) % rotatingTitles.length);
        }, PAUSE_AFTER_DELETE);
      }
    };

    const delay = isDeleting ? DELETE_SPEED : text.length === 0 ? 50 : TYPING_SPEED;
    timeoutRef.current = setTimeout(tick, delay);
    return () => clearTimeout(timeoutRef.current);
  }, [index, text, isDeleting]);

  return (
    <span className="typewriter">
      {rotatingTitles[index].slice(0, text.length)}
      <span className="typewriter__caret" aria-hidden />
      <style>{`
        .typewriter {
          color: var(--accent);
          font-family: var(--font-mono);
        }
        .typewriter__caret {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: var(--accent);
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: caret-blink 1s step-end infinite;
        }
        @keyframes caret-blink {
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
