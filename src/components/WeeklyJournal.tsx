import { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ExternalLink, GraduationCap, Linkedin, Mail, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { deliveryChain, infrastructureCopy, infrastructureLayers, journalArticles, journalIssues, journalSources, journalTopics, weeklyCopy } from '../data/weeklyJournal';
import '../weekly.css';

function InfrastructureSchematic() {
  const { language } = useLanguage();
  const v = infrastructureCopy[language];
  return (
    <figure className="wj-schematic">
      <div className="wj-schematic-top"><span>{v.diagramTag}</span><span aria-hidden="true">FIG. 01 / AI INFRA</span></div>
      <div className="wj-schematic-scene">
        <img className="wj-schematic-tower" src="/ai-infrastructure-tower-v2.png" alt={v.diagram} width="1097" height="1434" decoding="async" />
        <ol className="wj-schematic-layers">
          {infrastructureLayers.map(layer => <li key={layer.id}>
            <span className="wj-layer-number">{layer.id}</span>
            <div><strong>{layer.title}</strong><span>{layer.description[language]}</span></div>
          </li>)}
        </ol>
      </div>
      <figcaption><span>{v.diagramFooter}</span><small>{v.diagramNote}</small></figcaption>
    </figure>
  );
}

function AuthorProfile() {
  const { language } = useLanguage();
  const v = infrastructureCopy[language];
  return <section id="about" className="wj-about" aria-labelledby="journal-about-title">
    <div className="wj-about-intro"><div className="wj-kicker">{v.aboutLabel}</div><h2 id="journal-about-title">{v.aboutTitle}</h2><div className="wj-author-name">Lawrence Chen<span>TECHWITHLC</span></div><p>{v.aboutBody}</p><div className="wj-author-links"><a href="https://www.linkedin.com/in/klunlawrencechen/" target="_blank" rel="noopener noreferrer"><Linkedin size={15}/>{v.linkedin}<ExternalLink size={12}/></a><a href="mailto:kuanlunlawrence.chen@gmail.com"><Mail size={15}/>{v.email}</a></div></div>
    <div className="wj-background">
      <section aria-labelledby="journal-experience-title"><h3 id="journal-experience-title">{v.experience}</h3><div className="wj-timeline">
        <div><span>2026 — {v.present}</span><strong>Visionbay.ai</strong><p>{v.visionRole}</p></div>
        <div><span>2025 — 2026</span><strong>{v.independentOrg}</strong><p>{v.independent}</p></div>
        <div><span>2025</span><strong>{v.cathay}</strong><p>{v.cathayRole}</p></div>
        <div><span>2022 — 2024</span><strong>Amazon Web Services</strong><p>{v.awsRole}</p></div>
      </div></section>
      <section className="wj-education" aria-labelledby="journal-education-title"><h3 id="journal-education-title">{v.education}</h3>
        <div className="wj-school"><a className="wj-school-mark" href="https://www.linkedin.com/school/2624/" target="_blank" rel="noopener noreferrer"><img src="/columbia-university.jpg" alt={v.logoAlt} width="54" height="54" loading="lazy" /></a><div><a className="wj-school-name" href="https://www.linkedin.com/school/2624/" target="_blank" rel="noopener noreferrer">Columbia University<ExternalLink size={12}/></a><p>{v.columbiaDegree}</p><span>{v.columbiaDates}</span><small>{v.columbiaActivities}</small></div></div>
        <div className="wj-school"><div className="wj-school-mark wj-school-neutral" aria-hidden="true"><GraduationCap size={25}/></div><div><strong>{v.tunghai}</strong><p>{v.tunghaiDegree}</p><span>{v.tunghaiDates}</span></div></div>
      </section>
    </div>
  </section>;
}

export default function WeeklyJournal({ issueId, dark, onToggleTheme }: {
  issueId?: string;
  dark: boolean;
  onToggleTheme: () => void;
}) {
  const { language, toggleLanguage } = useLanguage();
  const c = weeklyCopy[language];
  const v = infrastructureCopy[language];
  const [topic, setTopic] = useState('all');
  const issue = journalIssues.find(item => item.id === issueId);
  const next = issue && journalIssues[journalIssues.indexOf(issue) + 1];
  const first = [...journalIssues].reverse().find(item => item.status === 'published') ?? journalIssues.find(item => item.status === 'draft') ?? journalIssues[0];
  const articleSections = issue && journalArticles[issue.id];
  const filtered = journalIssues.filter(item => topic === 'all' || item.topic === topic);

  useEffect(() => {
    const previous = document.title;
    document.title = `${issue ? issue.title[language] : c.title} — TechwithLC`;
    return () => { document.title = previous; };
  }, [issue, language, c.title]);

  return (
    <div className="wj wj-page">
      <nav className="wj-nav" aria-label={c.archive}>
        <a className="wj-brand" href="#"><span className="wj-brand-mark" aria-hidden="true"><i/><i/><i/></span>TechwithLC<span className="wj-brand-subtitle">/ AI INFRA</span></a>
        <div className="wj-nav-actions">
          <a className="wj-nav-link" href="#journal-roadmap">{v.navJournal}</a>
          <a className="wj-nav-link" href="#about">{v.navAbout}</a>
          <button onClick={toggleLanguage} aria-label={language === 'en' ? '切換至繁體中文' : 'Switch to English'}>{language === 'en' ? '繁中' : 'EN'}</button>
          <button onClick={onToggleTheme} aria-label={c.theme}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
        </div>
      </nav>

      <main className="wj-main">
        {!issueId ? <>
          <header className="wj-hero">
            <div className="wj-hero-copy">
              <div className="wj-kicker"><span className="wj-dot" />{v.subtitle}</div>
              <h1>{v.heroLine}</h1>
              <p className="wj-dek">{v.heroBody}</p>
              <p className="wj-intro">{v.heroByline}</p>
              <div className="wj-hero-actions">
                <a className="wj-button" href={`#weekly/${first.id}`}>{first.status === 'published' ? c.readPublished : c.read}<ArrowRight size={17} /></a>
                <a className="wj-text-link" href="#journal-roadmap">{c.archive}<ArrowDown size={15} /></a>
              </div>
            </div>
            <InfrastructureSchematic />
          </header>

          <div className="wj-research-strip" aria-label={v.research}>{journalTopics.map((item, index) => <a href="#journal-roadmap" onClick={() => setTopic(item.id)} key={item.id}><span>0{index + 1}</span>{item.label[language]}<ArrowRight size={13}/></a>)}</div>

          <section className="wj-feature" aria-labelledby="journal-feature-title">
            <div className="wj-feature-index" aria-hidden="true">{first.id}<span>FIELD NOTE</span></div>
            <div className="wj-feature-content">
              <div className="wj-kicker">{v.latest}<span className="wj-status">{c[first.status]}</span></div>
              <h2 id="journal-feature-title"><a href={`#weekly/${first.id}`}>{first.title[language]}</a></h2>
              <p>{first.question[language]}</p>
              <a className="wj-text-link" href={`#weekly/${first.id}`}>{c.preview}<ArrowRight size={16} /></a>
            </div>
          </section>

          <section id="journal-roadmap" className="wj-roadmap" aria-labelledby="journal-roadmap-title">
            <div className="wj-kicker">{v.sectionTag}</div>
            <h2 id="journal-roadmap-title">{v.archiveTitle}</h2>
            <p className="wj-muted">{c.roadmapNote}</p>
            <div className="wj-filters" role="group" aria-label={c.topic}>
              {[{ id: 'all', label: { en: weeklyCopy.en.all, zh: weeklyCopy.zh.all } }, ...journalTopics].map(item => <button key={item.id} aria-pressed={topic === item.id} onClick={() => setTopic(item.id)}>{item.label[language]}</button>)}
            </div>
            <div className="wj-issues" aria-live="polite">
              {filtered.map(item => <a className="wj-issue-card" href={`#weekly/${item.id}`} key={item.id}>
                <div className="wj-card-top"><span className="wj-issue-number">{item.id}</span><span className={item.status === 'draft' ? 'wj-status' : 'wj-status wj-status-planned'}>{c[item.status]}</span></div>
                <div className="wj-card-topic">{journalTopics.find(entry => entry.id === item.topic)?.label[language]}</div>
                <h3>{item.title[language]}</h3>
                <p>{item.question[language]}</p>
                <span className="wj-card-arrow" aria-hidden="true"><ArrowRight size={18} /></span>
              </a>)}
            </div>
          </section>
          <AuthorProfile />
        </> : <div className="wj-reading">
          <a className="wj-text-link wj-back" href="#weekly"><ArrowLeft size={15} />{c.back}</a>
          {!issue ? <><h1>{c.notFound}</h1><p>{c.notFoundNote}</p></> : <>
            <header className="wj-article-header">
              <div className="wj-kicker">FIELD NOTE / {issue.id}<span className="wj-status">{c[issue.status]}</span></div>
              <h1>{issue.title[language]}</h1>
              <p className="wj-dek">{issue.question[language]}</p>
              <div className="wj-byline"><span>{c.author}</span>{articleSections && <span>{c.minute}</span>}</div>
            </header>
            {issue.status !== 'planned' && articleSections ? <>
              {issue.status === 'draft' && <p className="wj-notice">{c.draftNote}</p>}
              <article className="wj-prose">
                {articleSections.map((section, index) => <section key={index}>
                  <h2>{section.title[language]}</h2>
                  {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph[language]}</p>)}
                  {section.sourceIds.length > 0 && <div className="wj-inline-sources">{section.sourceIds.map(id => {
                    const source = journalSources.find(entry => entry.id === id);
                    return source && <a key={id} href={source.url} target="_blank" rel="noopener noreferrer">{source.title[language]}<ExternalLink size={12} /></a>;
                  })}</div>}
                  {index === 0 && <figure className="wj-chain"><figcaption>{c.chainTitle}</figcaption><ol>{deliveryChain.map((step, stepIndex) => <li key={stepIndex}><span>0{stepIndex + 1}</span>{step[language]}</li>)}</ol><p>{c.chainNote}</p></figure>}
                </section>)}
              </article>
              <section className="wj-sources" aria-labelledby="journal-sources-title"><div className="wj-kicker">{c.reviewed}</div><h2 id="journal-sources-title">{c.sources}</h2><ol>{journalSources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title[language]}<ExternalLink size={14} /></a></li>)}</ol></section>
            </> : <section className="wj-planned-detail"><span className="wj-kicker">{c.notPublished}</span><p>{c.notPublishedNote}</p><h2>{c.outline}</h2><p>{issue.outline[language]}</p></section>}
            {next && <a className="wj-next" href={`#weekly/${next.id}`}><span className="wj-kicker">{c.next} / {next.id} · {c[next.status]}</span><span>{next.title[language]}<ArrowRight size={20} /></span></a>}
          </>}
        </div>}
        <footer className="wj-footer"><span>TechwithLC / FIELD NOTES</span><p>{c.footer}</p></footer>
      </main>
    </div>
  );
}
