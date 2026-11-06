import { useEffect, useState } from 'react';
import WeeklyJournal from './components/WeeklyJournal';

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');
  const issueId = hash.startsWith('#weekly/') ? hash.slice('#weekly/'.length) : undefined;

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    if (hash === '#about' || hash === '#journal-roadmap') {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [hash]);

  return <WeeklyJournal issueId={issueId} dark={dark} onToggleTheme={() => setDark(value => !value)} />;
}
