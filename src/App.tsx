import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ChevronUp, ExternalLink, Youtube } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import EmbedFacade from './components/EmbedFacade';
import BlogList from './components/BlogList';
import BlogPostDetail from './components/BlogPostDetail';
import SponsorSection from './components/SponsorSection';

const YOUTUBE_CHANNEL_USERNAME = '@techwithlc';

// Threads icon
const ThreadsIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 192 192" fill="currentColor">
    <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.368c-14.973 0-27.457 6.929-35.049 18.876l13.494 9.266c5.689-8.624 14.626-10.459 21.555-10.459h.252c8.327.052 14.612 2.47 18.69 7.184 2.977 3.39 4.971 8.058 5.954 13.952a110.168 110.168 0 0 0-23.682-2.138c-23.857 0-39.194 13.214-39.194 34.641 0 21.427 16.622 34.641 39.194 34.641 22.572 0 40.865-13.214 40.865-34.641a32.87 32.87 0 0 0-.736-6.479ZM96 145.96c-12.842 0-22.449-5.865-22.449-15.578 0-9.713 9.607-15.579 22.449-15.579 13.021 0 22.449 5.866 22.449 15.579s-9.428 15.578-22.449 15.578ZM172.265 96c0 41.989-34.276 76.265-76.265 76.265S19.735 137.989 19.735 96 54.011 19.735 96 19.735 172.265 54.011 172.265 96Z"/>
  </svg>
);

const PodcastIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
  </svg>
);

function App() {
  const { t, language, toggleLanguage } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [latestVideoId, setLatestVideoId] = useState('');
  const [currentBlogSlug, setCurrentBlogSlug] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#blog/')) {
        setCurrentBlogSlug(hash.replace('#blog/', ''));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentBlogSlug(null);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const fetchLatestYouTubeVideo = async () => {
      try {
        const cacheKey = 'latestYouTubeVideoId:v1';
        const cacheRaw = sessionStorage.getItem(cacheKey);
        if (cacheRaw) {
          const cache = JSON.parse(cacheRaw) as { videoId: string; ts: number };
          if (cache.videoId && Date.now() - cache.ts < 30 * 60 * 1000) {
            setLatestVideoId(cache.videoId);
            return;
          }
        }
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 8000);
        const resp = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UC_qQ8-E8YbRQU8cEOLHtOtw`,
          { signal: controller.signal }
        );
        window.clearTimeout(timeout);
        if (!resp.ok) throw new Error(`RSS fetch failed: ${resp.status}`);
        const data = (await resp.json()) as any;
        if (data?.items?.[0]) {
          const videoLink = data.items[0].link as string;
          const videoId = videoLink.split('v=')[1]?.split('&')[0];
          if (videoId) {
            setLatestVideoId(videoId);
            sessionStorage.setItem(cacheKey, JSON.stringify({ videoId, ts: Date.now() }));
          }
        }
      } catch {
        setLatestVideoId('');
      }
    };
    fetchLatestYouTubeVideo();
  }, []);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubscribing(true);
    setSubscribeMessage('');
    setSubscribeSuccess(false);
    if (!subscribeEmail.trim() || !/\S+@\S+\.\S+/.test(subscribeEmail)) {
      setSubscribeMessage(t.common.invalidEmail);
      setSubscribeSuccess(false);
      setIsSubscribing(false);
      return;
    }
    try {
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Server error: ${response.status}`);
      setSubscribeMessage(result.message);
      setSubscribeSuccess(result.success || false);
      if (result.success) {
        setTimeout(() => { setSubscribeEmail(''); setSubscribeMessage(''); }, 3000);
      }
    } catch (error) {
      setSubscribeMessage(error instanceof Error ? error.message : t.common.subscribeError);
      setSubscribeSuccess(false);
    } finally {
      setIsSubscribing(false);
    }
  };

  if (currentBlogSlug) {
    return (
      <BlogPostDetail
        slug={currentBlogSlug}
        onBack={() => { window.location.hash = '#blog'; setCurrentBlogSlug(null); }}
      />
    );
  }

  return (
    <div id="top" className="min-h-screen bg-white text-gray-900">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/60 mx-auto-none">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
        {/* Logo: TechwithLC collapses letter by letter → "AI" */}
        <span className="relative inline-flex items-center text-sm font-semibold tracking-tight text-gray-900 whitespace-nowrap"
          style={{ height: '1.25rem' }}>
          {/* Full name — each letter collapses on scroll */}
          <span className="inline-flex" style={{ opacity: scrolled ? 0 : 1, transition: 'opacity 0.3s ease 0.1s', position: scrolled ? 'absolute' : 'relative', pointerEvents: scrolled ? 'none' : 'auto' }}>
            {'TechwithLC'.split('').map((char, i) => (
              <span key={i} style={{
                display: 'inline-block',
                maxWidth: scrolled ? '0ch' : '1.2ch',
                opacity: scrolled ? 0 : 1,
                overflow: 'hidden',
                transition: `max-width 0.35s cubic-bezier(0.4,0,0.2,1) ${i * 15}ms, opacity 0.25s ease ${i * 15}ms`,
              }}>{char}</span>
            ))}
          </span>
          {/* "AI" — fades in after collapse */}
          <span style={{
            opacity: scrolled ? 1 : 0,
            transform: scrolled ? 'translateX(0)' : 'translateX(-6px)',
            transition: 'opacity 0.3s ease 0.25s, transform 0.3s ease 0.25s',
            position: scrolled ? 'relative' : 'absolute',
            pointerEvents: scrolled ? 'auto' : 'none',
          }}>AI</span>
        </span>
        <div className="flex items-center gap-4">
          <a href="https://github.com/techwithlc" target="_blank" rel="noopener noreferrer"
            aria-label="GitHub" className="text-gray-400 hover:text-gray-700 transition-colors">
            <Github className="h-4 w-4" />
          </a>
          <a href="https://www.linkedin.com/in/klunlawrencechen/" target="_blank" rel="noopener noreferrer"
            aria-label="LinkedIn" className="text-gray-400 hover:text-gray-700 transition-colors">
            <Linkedin className="h-4 w-4" />
          </a>
          <a href="https://www.threads.com/@techwithlc" target="_blank" rel="noopener noreferrer"
            aria-label="Threads" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ThreadsIcon />
          </a>
          <a href="https://www.youtube.com/@techwithlc" target="_blank" rel="noopener noreferrer"
            aria-label="YouTube" className="text-gray-400 hover:text-gray-700 transition-colors">
            <Youtube className="h-4 w-4" />
          </a>
          <a href="mailto:kuanlunlawrence.chen@gmail.com"
            aria-label="Email" className="text-gray-400 hover:text-gray-700 transition-colors">
            <Mail className="h-4 w-4" />
          </a>
          <button
            onClick={toggleLanguage}
            className="ml-2 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
          >
            {language === 'en' ? '中文' : 'EN'}
          </button>
        </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-6 pb-24">

        {/* ── Hero ── */}
        <section className="pt-8 pb-16">
          {/* Hero illustration with bounce-in + parallax + hotspots */}
          <div className="relative mb-8 overflow-hidden rounded-2xl bg-[#f5f0e8] select-none" style={{ height: '320px' }}>

            {/* Base illustration — bounces in then parallax on mousemove */}
            <div
              className="layer-bounce"
              style={{
                position: 'absolute', inset: '-10px',
                animationDelay: '0.2s',
                transform: `translate(${mousePos.x * -6}px, ${mousePos.y * -4}px)`,
                transition: 'transform 0.15s ease-out',
              }}
            >
              <img
                src="/hero-illustration.png"
                alt="Lawrence at his desk"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
              />
            </div>

            {/* Where I Lived hotspot — over the window */}
            <button
              onClick={() => setActiveHotspot(activeHotspot === 'cities' ? null : 'cities')}
              style={{ position: 'absolute', top: '8%', right: '10%', width: '28%', height: '44%', cursor: 'pointer' }}
              className="group z-10"
              aria-label="Where I've lived"
            >
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gray-900 px-2.5 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Where I've Lived ✈️
              </span>
            </button>

            {/* Books hotspot */}
            <button
              onClick={() => setActiveHotspot(activeHotspot === 'books' ? null : 'books')}
              style={{ position: 'absolute', bottom: '10%', left: '1%', width: '13%', height: '50%', cursor: 'pointer' }}
              className="group z-10"
              aria-label="Things I Love"
            >
              <span className="absolute -top-7 left-0 whitespace-nowrap rounded-full bg-sky-500 px-2.5 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Things I Love 📚
              </span>
            </button>

            {/* LinkedIn mug hotspot */}
            <a href="https://www.linkedin.com/in/klunlawrencechen/" target="_blank" rel="noopener noreferrer"
              className="group z-10"
              style={{ position: 'absolute', top: '52%', left: '17%', width: '8%', height: '20%' }}
              aria-label="LinkedIn"
            >
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-600 px-2.5 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                LinkedIn ☕
              </span>
            </a>

            {/* Camera hotspot → GitHub */}
            <a href="https://github.com/techwithlc" target="_blank" rel="noopener noreferrer"
              className="group z-10"
              style={{ position: 'absolute', top: '48%', right: '8%', width: '9%', height: '22%' }}
              aria-label="GitHub"
            >
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gray-900 px-2.5 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                GitHub 📷
              </span>
            </a>

            {/* ── Popup: Cities ── */}
            {activeHotspot === 'cities' && (
              <div
                style={{ position: 'absolute', top: '8%', right: '4%', zIndex: 20 }}
                className="animate-fadeIn rounded-xl bg-white p-4 shadow-xl text-sm w-48"
              >
                <p className="mb-2 font-semibold text-gray-800">📍 Where I've Lived</p>
                <div className="space-y-1.5 text-gray-600 text-xs">
                  {[
                    { city: 'Taichung, Taiwan', period: '1997 – 2022' },
                    { city: 'Dublin, Ireland', period: '2022 – 2024' },
                    { city: 'Taipei, Taiwan', period: '2024 – present' },
                  ].map(({ city, period }) => (
                    <div key={city} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                      <span>{city} <span className="text-gray-400">{period}</span></span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveHotspot(null)} className="mt-3 text-xs text-gray-400 hover:text-gray-600">close ×</button>
              </div>
            )}

            {/* ── Popup: Books ── */}
            {activeHotspot === 'books' && (
              <div
                style={{ position: 'absolute', bottom: '10%', left: '22%', zIndex: 20 }}
                className="animate-fadeIn rounded-xl bg-white p-4 shadow-xl text-sm w-52"
              >
                <p className="mb-2 font-semibold text-gray-800">📚 Things I Really Love</p>
                <div className="space-y-1 text-xs text-gray-600">
                  {['AWS re:Invent', 'Mechanical keyboards', 'Golden retrievers', 'Cold brew coffee', 'Vim motions', 'Lo-fi hip hop', 'System design books', 'Taiwanese beef noodles'].map((item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <span className="text-sky-400">→</span> {item}
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveHotspot(null)} className="mt-3 text-xs text-gray-400 hover:text-gray-600">close ×</button>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Lawrence Chen
          </h1>
          <p className="mt-2 text-base text-gray-500">
            {language === 'en'
              ? 'Senior Cloud / SRE Engineer · Content Creator · Dublin-eligible (Stamp 4)'
              : '資深雲端 / SRE 工程師 · 內容創作者 · 愛爾蘭 Stamp 4'}
          </p>
          <p className="mt-5 text-base leading-relaxed text-gray-700">
            {language === 'en'
              ? "5+ years operating large-scale production systems across AWS, GCP, and Azure. Former AWS Ireland Cloud Support Engineer — 500+ enterprise customers, 95% first-contact resolution. Strong background in incident response, observability, RCA, and on-call operations. Founder of TechwithLC, a cloud learning community for the Chinese-speaking world."
              : '超過 5 年大規模生產系統運營經驗，橫跨 AWS、GCP、Azure。前 AWS 愛爾蘭雲端支援工程師，服務 500+ 企業客戶，95% 首次聯絡解決率。擅長事件應對、可觀測性、根本原因分析與 On-call 運營。TechwithLC 創辦人，服務華語雲端學習社群。'}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="#projects" className="text-emerald-600 hover:text-emerald-700 font-medium">
              {language === 'en' ? 'Projects ↓' : '專案 ↓'}
            </a>
            <a href="#writing" className="text-emerald-600 hover:text-emerald-700 font-medium">
              {language === 'en' ? 'Writing ↓' : '文章 ↓'}
            </a>
            <a href="#contact" className="text-emerald-600 hover:text-emerald-700 font-medium">
              {language === 'en' ? 'Contact ↓' : '聯絡 ↓'}
            </a>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* ── Timeline ── */}
        <section className="py-14">
          <h2 className="mb-8 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {language === 'en' ? 'Timeline' : '經歷'}
          </h2>
          <div className="space-y-5">
            {[
              { period: 'Nov 2025 –', role: language === 'en' ? 'Independent Cloud Architect' : '獨立雲端架構師', org: language === 'en' ? 'Self-employed · APAC' : '自雇 · 亞太區' },
              { period: 'May – Oct 2025', role: language === 'en' ? 'Senior Site Reliability Engineer' : '資深 SRE 工程師', org: 'Cathay Financial Holdings · Taipei' },
              { period: 'Apr 2022 – Jul 2024', role: language === 'en' ? 'Cloud Support Engineer' : '雲端支援工程師', org: 'Amazon Web Services · Dublin' },
              { period: '2020 –', role: language === 'en' ? 'Founder' : '創辦人', org: 'TechwithLC' },
              { period: 'Sep 2016 – Jul 2020', role: language === 'en' ? 'B.S. Information Management' : '資訊管理學士', org: language === 'en' ? 'Tunghai University · Taichung' : '東海大學 · 台中' },
            ].map((item) => (
              <div key={item.period} className="grid grid-cols-[130px_1fr] gap-4">
                <span className="pt-0.5 text-sm text-gray-400 tabular-nums">{item.period}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.role}</p>
                  <p className="text-sm text-gray-400">{item.org}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* ── Projects ── */}
        <section id="projects" className="py-14">
          <h2 className="mb-8 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {language === 'en' ? "Stuff I've Built" : '我做過的事'}
          </h2>
          <div className="space-y-5">
            {[
              {
                title: language === 'en' ? 'TechwithLC YouTube' : 'TechwithLC YouTube',
                desc: language === 'en' ? 'Cloud engineering tutorials, AWS/GCP/Azure guides, and career advice. 100+ videos.' : '雲端工程教學、AWS/GCP/Azure 指南與職涯建議，100+ 支影片。',
                link: 'https://www.youtube.com/@techwithlc',
                tags: ['YouTube', 'Cloud'],
                embed: true,
                embedType: 'youtube' as const,
              },
              {
                title: language === 'en' ? '歐趴 Podcast' : '歐趴 Podcast',
                desc: language === 'en' ? 'A Chinese-language tech podcast covering cloud, AI, and engineering careers.' : '華語技術 Podcast，涵蓋雲端、AI 與工程師職涯。',
                link: 'https://pocketcasts.com/podcast/%E6%AD%90%E8%B6%B4/2aa32b80-9572-013d-92a0-0afff0a90ec3',
                tags: ['Podcast'],
                embed: true,
                embedType: 'spotify' as const,
              },
              {
                title: 'CoffeeLover',
                desc: language === 'en' ? 'A coffee discovery app built with React + Tailwind.' : '用 React + Tailwind 打造的咖啡探索應用。',
                link: 'https://coffeelover.fun',
                tags: ['React', 'Tailwind'],
              },
              {
                title: 'Yue Lao AI',
                desc: language === 'en' ? 'AI matchmaking side project. Because why not.' : 'AI 媒人專案，因為人生苦短。',
                link: 'https://yuelao69.netlify.app',
                tags: ['AI'],
              },
              {
                title: language === 'en' ? 'Google Interview Story' : 'Google 面試分享',
                desc: language === 'en' ? 'My experience interviewing at Google Taiwan — no BS, full story.' : '我的 Google 台灣面試全紀錄，不藏私。',
                link: 'https://medium.com/@awslc/google-%E5%8F%B0%E7%81%A3%E9%9D%A2%E8%A9%A6%E5%88%86%E4%BA%AB-%E7%84%A1%E8%97%8F%E7%A7%81-bd28935d35f3',
                tags: ['Career'],
              },
            ].map((project) => (
              <div key={project.title}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                      >
                        {project.title}
                      </a>
                      <ExternalLink className="h-3 w-3 text-gray-300 flex-shrink-0" />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{project.desc}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {project.embed && (
                  <div className="mt-3 h-[180px] overflow-hidden rounded-xl border border-gray-100">
                    <EmbedFacade
                      embedUrl={
                        project.embedType === 'youtube'
                          ? latestVideoId
                            ? `https://www.youtube.com/embed/${latestVideoId}`
                            : `https://www.youtube.com/embed?listType=user_uploads&list=${YOUTUBE_CHANNEL_USERNAME}`
                          : 'https://open.spotify.com/embed/show/0dfTD5n0Rfuco9z24BhaS0?utm_source=generator'
                      }
                      title={project.title}
                      type={project.embedType}
                      externalLink={project.link}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* ── Tech Stack ── */}
        <section className="py-14">
          <h2 className="mb-8 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {language === 'en' ? 'Tech Stack' : '技術棧'}
          </h2>
          <div className="space-y-4 text-sm text-gray-600">
            {[
              { cat: language === 'en' ? 'Cloud' : '雲端', items: 'AWS (Advanced) · Azure · GCP' },
              { cat: language === 'en' ? 'Observability' : '可觀測性', items: 'Metrics · Logs · Traces · Dashboards · Incident Analysis' },
              { cat: language === 'en' ? 'Containers' : '容器', items: 'Docker · Kubernetes' },
              { cat: language === 'en' ? 'Automation' : '自動化', items: 'Python · Bash · Terraform' },
              { cat: 'CI/CD', items: 'GitHub Actions · GitLab CI · Jenkins' },
              { cat: language === 'en' ? 'IT Ops' : '運維', items: language === 'en' ? 'On-call · Incident escalation · Post-incident RCA' : 'On-call · 事件升級 · 事後 RCA' },
              { cat: language === 'en' ? 'Certs' : '證照', items: 'AWS SA Pro · AWS AIF · AZ-900 · SC-900' },
            ].map(({ cat, items }) => (
              <div key={cat} className="grid grid-cols-[130px_1fr] gap-2">
                <span className="font-medium text-gray-400">{cat}</span>
                <span>{items}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* ── Writing / Blog ── */}
        <section id="writing" className="py-14">
          <h2 className="mb-8 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {language === 'en' ? 'Writing' : '文章'}
          </h2>
          <BlogList maxPosts={6} />
        </section>

        <hr className="border-gray-100" />

        {/* ── Newsletter ── */}
        <section className="py-14">
          <h2 className="mb-8 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {language === 'en' ? 'Newsletter' : '電子報'}
          </h2>
          <p className="mb-5 text-sm text-gray-500">
            {language === 'en'
              ? 'Cloud + AI + career insights, weekly. No spam.'
              : '每週雲端、AI、職涯洞察。不發垃圾郵件。'}
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder={language === 'en' ? 'your@email.com' : '你的信箱'}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              required
              disabled={isSubscribing}
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60 transition-colors"
            >
              {isSubscribing
                ? (language === 'en' ? 'Subscribing…' : '訂閱中…')
                : (language === 'en' ? 'Subscribe' : '訂閱')}
            </button>
          </form>
          {subscribeMessage && (
            <p className={`mt-3 text-sm ${subscribeSuccess ? 'text-emerald-600' : 'text-red-600'}`}>
              {subscribeMessage}
            </p>
          )}
        </section>

        <hr className="border-gray-100" />

        {/* ── Sponsor ── */}
        <section className="py-14">
          <SponsorSection />
        </section>

        <hr className="border-gray-100" />

        {/* ── Contact ── */}
        <section id="contact" className="py-14">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {language === 'en' ? 'Get In Touch' : '聯絡我'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {language === 'en'
              ? 'Open to collaborations, sponsorships, and interesting conversations.'
              : '歡迎合作、贊助或有趣的對話。'}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {[
              { href: 'mailto:kuanlunlawrence.chen@gmail.com', label: 'Email', icon: <Mail className="h-4 w-4" /> },
              { href: 'https://github.com/techwithlc', label: 'GitHub', icon: <Github className="h-4 w-4" /> },
              { href: 'https://www.linkedin.com/in/klunlawrencechen/', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
              { href: 'https://www.threads.com/@techwithlc', label: 'Threads', icon: <ThreadsIcon /> },
              { href: 'https://www.youtube.com/@techwithlc', label: 'YouTube', icon: <Youtube className="h-4 w-4" /> },
              { href: 'https://pocketcasts.com/podcast/%E6%AD%90%E8%B6%B4/2aa32b80-9572-013d-92a0-0afff0a90ec3', label: 'Podcast', icon: <PodcastIcon /> },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-gray-100 pt-8 pb-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Lawrence Chen · TechwithLC
          </p>
        </footer>

      </main>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-gray-900 p-2.5 text-white shadow-lg hover:bg-gray-700 transition-colors"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default App;
