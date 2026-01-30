import { useState, useEffect } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  ChevronUp,
  ArrowRight,
  Play,
  Zap,
  BarChart3,
  Shield,
  Sparkles,
  Clock,
  TrendingUp,
  Users,
  Star,
} from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import EmbedFacade from './components/EmbedFacade';
import WebsitePreview from './components/WebsitePreview';
import BlogList from './components/BlogList';
import BlogPostDetail from './components/BlogPostDetail';
import SponsorSection from './components/SponsorSection';

// YouTube channel username for RSS feed
const YOUTUBE_CHANNEL_USERNAME = '@techwithlc';

function App() {
  const { t, language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [latestVideoId, setLatestVideoId] = useState('');
  const [currentBlogSlug, setCurrentBlogSlug] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: t.nav.home, href: '#top' },
    { label: t.nav.techStack, href: '#features' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.blog, href: '#blog' },
    { label: t.nav.contact, href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash routing for blog posts
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#blog/')) {
        const slug = hash.replace('#blog/', '');
        setCurrentBlogSlug(slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentBlogSlug(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch latest YouTube video
  useEffect(() => {
    const fetchLatestYouTubeVideo = async () => {
      try {
        // Cache for 30 minutes to reduce repeated calls
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
            sessionStorage.setItem(
              cacheKey,
              JSON.stringify({ videoId, ts: Date.now() })
            );
          }
        }
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        setLatestVideoId('');
      }
    };

    fetchLatestYouTubeVideo();
  }, []);

  // Subscription Handler
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

      if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`);
      }

      setSubscribeMessage(result.message);
      setSubscribeSuccess(result.success || false);

      if (result.success) {
        setTimeout(() => {
          setSubscribeEmail('');
          setSubscribeMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Subscription fetch error:', error);
      setSubscribeMessage(
        error instanceof Error ? error.message : t.common.subscribeError
      );
      setSubscribeSuccess(false);
    } finally {
      setIsSubscribing(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Blog post detail view
  if (currentBlogSlug) {
    return (
      <BlogPostDetail
        slug={currentBlogSlug}
        onBack={() => {
          window.location.hash = '#blog';
          setCurrentBlogSlug(null);
        }}
      />
    );
  }

  return (
    <div id="top" className="min-h-screen bg-white text-gray-900">
      {/* Navigation - Ramp style */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TechwithLC</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {language === 'en' ? t.lang.zh : t.lang.en}
            </button>

            <a
              href="#contact"
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              {t.nav.getStarted}
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-gray-100 bg-white md:hidden">
            <div className="space-y-1 px-6 py-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section - Ramp style */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white pt-32 pb-20 md:pt-40 md:pb-32">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-yellow-100/50 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 md:grid-cols-2">
              {/* Badge */}
              <div className="text-center md:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
                  <Sparkles className="h-4 w-4" />
                  {t.hero.welcome}
                </div>

                {/* Main headline */}
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  {t.hero.title}
                  <span className="mt-2 block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    {t.hero.tagline}
                  </span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:mx-0 md:text-xl">
                  {t.hero.subtitle}
                </p>

                {/* CTA buttons */}
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
                  <a
                    href="#projects"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 transition-all hover:shadow-xl sm:w-auto"
                  >
                    {t.buttons.exploreProjects}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href="https://www.youtube.com/@techwithlc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all sm:w-auto"
                  >
                    <Play className="h-4 w-4" />
                    {t.hero.watchVideos}
                  </a>
                </div>
              </div>

              {/* Product-style mock card */}
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-emerald-200/30 via-white to-teal-200/20 blur-2xl" />
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_25px_60px_-30px_rgba(15,23,42,0.25)]">
                  <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div className="leading-tight">
                        <p className="text-sm font-semibold text-gray-900">
                          {t.hero.tagline}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t.logoBar.title}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {t.common.live}
                    </span>
                  </div>

                  <div className="grid gap-4 p-6 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-xs font-semibold text-gray-500">
                        {t.stats.subscribers}
                      </p>
                      <p className="mt-1 text-3xl font-bold text-gray-900">
                        500+
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        {t.newsletter.noSpam}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-xs font-semibold text-gray-500">
                        {t.stats.videos}
                      </p>
                      <p className="mt-1 text-3xl font-bold text-gray-900">
                        100+
                      </p>
                      <div className="mt-3 flex items-end gap-1">
                        {[8, 12, 9, 14, 11, 16].map((h, i) => (
                          <div
                            key={i}
                            style={{ height: `${h * 4}px` }}
                            className="w-2 rounded-t-md bg-emerald-200"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="font-medium">{t.blog.badge}</span>
                      <a
                        href="#blog"
                        className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-600"
                      >
                        {t.blog.readMore}
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { label: t.stats.subscribers, value: '500+', icon: Users },
                { label: t.stats.videos, value: '100+', icon: Play },
                { label: t.stats.techTopics, value: '50+', icon: BarChart3 },
                { label: t.stats.countries, value: '30+', icon: TrendingUp },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <stat.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logo bar - Trust badges */}
        <section className="border-y border-gray-100 bg-gray-50/50 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-gray-500">
              {t.logoBar.title}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {['AWS', 'Azure', 'GCP', 'React', 'TypeScript', 'Python', 'Kubernetes', 'Docker'].map(
                (logo) => (
                  <div
                    key={logo}
                    className="text-lg font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {logo}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Features Section - Ramp style cards */}
        <section id="features" className="py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
                <Zap className="h-4 w-4" />
                {t.features.badge}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                {t.techStack.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {t.techStack.description}
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/** Tailwind JIT can't see dynamic class names; keep these static */}
              {(() => {
                const colorStyles: Record<
                  string,
                  { bg: string; fg: string }
                > = {
                  emerald: { bg: 'bg-emerald-100', fg: 'text-emerald-600' },
                  blue: { bg: 'bg-blue-100', fg: 'text-blue-600' },
                  purple: { bg: 'bg-purple-100', fg: 'text-purple-600' },
                  orange: { bg: 'bg-orange-100', fg: 'text-orange-600' },
                  pink: { bg: 'bg-pink-100', fg: 'text-pink-600' },
                  teal: { bg: 'bg-teal-100', fg: 'text-teal-600' },
                };

                const features = [
                  { key: 'ai', icon: Sparkles, color: 'emerald', title: t.features.ai.title, description: t.features.ai.description },
                  { key: 'cloud', icon: Shield, color: 'blue', title: t.features.cloud.title, description: t.features.cloud.description },
                  { key: 'career', icon: TrendingUp, color: 'purple', title: t.features.career.title, description: t.features.career.description },
                  { key: 'devTools', icon: Zap, color: 'orange', title: t.features.devTools.title, description: t.features.devTools.description },
                  { key: 'systemDesign', icon: BarChart3, color: 'pink', title: t.features.systemDesign.title, description: t.features.systemDesign.description },
                  { key: 'weekly', icon: Clock, color: 'teal', title: t.features.weekly.title, description: t.features.weekly.description },
                ];

                return features.map((feature) => {
                  const s = colorStyles[feature.color] ?? colorStyles.emerald;
                  return (
                    <div
                      key={feature.key}
                      className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                    >
                      <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${s.bg}`}>
                        <feature.icon className={`h-6 w-6 ${s.fg}`} />
                      </div>
                      <h3 className="mb-3 text-xl font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="bg-gray-50 py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
                <Star className="h-4 w-4" />
                {t.projects.badge}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                {t.projects.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {t.projects.description}
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: t.projects.podcast.title,
                  description: t.projects.podcast.description,
                  tech: [t.projects.tech.podcast, t.projects.tech.techTrends],
                  spotifyEmbed: true,
                  embedUrl:
                    'https://open.spotify.com/embed/show/0dfTD5n0Rfuco9z24BhaS0?utm_source=generator',
                  link: undefined,
                },
                {
                  title: t.projects.youtube.title,
                  description: t.projects.youtube.description,
                  tech: [t.projects.tech.youtube, t.projects.tech.tutorials],
                  youtubeEmbed: true,
                  embedUrl: latestVideoId
                    ? `https://www.youtube.com/embed/${latestVideoId}`
                    : `https://www.youtube.com/embed?listType=user_uploads&list=${YOUTUBE_CHANNEL_USERNAME}`,
                  link: undefined,
                },
                {
                  title: t.projects.interview.title,
                  description: t.projects.interview.description,
                  tech: [t.projects.tech.career, t.projects.tech.google],
                  mediumEmbed: false,
                  link: 'https://medium.com/@awslc/google-%E5%8F%B0%E7%81%A3%E9%9D%A2%E8%A9%A6%E5%88%86%E4%BA%AB-%E7%84%A1%E8%97%8F%E7%A7%81-bd28935d35f3',
                  embedUrl: undefined,
                },
                {
                  title: t.projects.coffeeLover.title,
                  description: t.projects.coffeeLover.description,
                  tech: [t.projects.tech.react, t.projects.tech.tailwind],
                  websitePreview: true,
                  link: 'https://coffeelover.fun',
                  embedUrl: undefined,
                },
              ].map((project) => {
                if (project.websitePreview) {
                  return (
                    <WebsitePreview
                      key={project.title}
                      title={project.title}
                      description={project.description}
                      url={project.link!}
                      tech={project.tech}
                    />
                  );
                }
                return (
                  <div
                    key={project.title}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                  >
                    <div className="relative h-[220px] w-full flex-shrink-0 overflow-hidden bg-gray-100">
                      {project.spotifyEmbed ? (
                        <EmbedFacade
                          embedUrl={project.embedUrl}
                          title={project.title}
                          type="spotify"
                          externalLink="https://pocketcasts.com/podcast/%E6%AD%90%E8%B6%B4/2aa32b80-9572-013d-92a0-0afff0a90ec3"
                        />
                      ) : project.youtubeEmbed ? (
                        <EmbedFacade
                          embedUrl={project.embedUrl}
                          title={project.title}
                          type="youtube"
                          externalLink="https://www.youtube.com/@techwithlc"
                        />
                      ) : (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-16 w-16 text-gray-400 group-hover:text-emerald-500 transition-colors"
                          >
                            <path
                              fill="currentColor"
                              d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                    <div className="flex flex-grow flex-col p-6">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {project.title}
                      </h3>
                      <p className="mb-4 flex-grow text-sm text-gray-600 leading-relaxed">
                        {project.youtubeEmbed
                          ? t.youtube.description
                          : project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
                <BarChart3 className="h-4 w-4" />
                {t.blog.badge}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                {t.blog.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600">{t.blog.description}</p>
            </div>
            <div className="mt-16 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <BlogList maxPosts={6} />
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="relative overflow-hidden border-t border-gray-200 bg-gradient-to-b from-emerald-50/60 to-white py-20 md:py-28">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-100/30 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <Mail className="h-4 w-4" />
              {t.newsletter.subtitle}
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              {t.newsletter.title}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t.newsletter.description}
            </p>

            <form
              onSubmit={handleSubscribe}
              className="mx-auto mt-10 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-stretch"
            >
              <label className="sr-only" htmlFor="newsletter-email">
                {t.newsletter.placeholder}
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder={t.newsletter.placeholder}
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:rounded-r-none sm:rounded-l-xl sm:py-4 sm:px-6"
                required
                disabled={isSubscribing}
              />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="rounded-xl bg-gray-900 px-8 py-3.5 font-semibold text-white shadow-lg shadow-gray-900/10 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60 sm:rounded-l-none sm:rounded-r-xl sm:py-4"
                >
                  {isSubscribing ? t.newsletter.subscribing : t.newsletter.button}
                </button>
            </form>

            {subscribeMessage && (
              <p
                role="alert"
                className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${
                  subscribeSuccess
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {subscribeMessage}
              </p>
            )}

            <p className="mt-6 text-xs text-gray-500">
              {t.newsletter.noSpam}
            </p>
          </div>
        </section>

        {/* Sponsor Section */}
        <section className="py-20 md:py-32">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <SponsorSection />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-gray-50 py-20 md:py-32">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <Mail className="h-4 w-4" />
              {t.contact.badge}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              {t.contact.title}
            </h2>
            <p className="mt-4 text-lg text-gray-600">{t.contact.description}</p>

            <div className="mt-10 flex justify-center gap-4">
              {[
                {
                  href: 'https://github.com/techwithlc',
                  icon: Github,
                  label: t.footer.connect.github,
                },
                {
                  href: 'https://www.linkedin.com/in/klunlawrencechen/',
                  icon: Linkedin,
                  label: t.footer.connect.linkedin,
                },
                {
                  href: 'https://x.com/techwithlc0921',
                  icon: () => (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                  label: t.footer.connect.twitter,
                },
                {
                  href: 'mailto:kuanlunlawrence.chen@gmail.com',
                  icon: Mail,
                  label: t.footer.connect.email,
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="group rounded-full border border-gray-200 bg-white p-4 text-gray-600 shadow-sm hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">
                  TechwithLC
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {t.footer.tagline}
              </p>
              <p className="text-sm text-gray-400">
                {t.footer.copyright}
              </p>
            </div>
          </div>
        </footer>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 rounded-full bg-gray-900 p-3 text-white shadow-lg hover:bg-gray-800 transition-colors"
            aria-label={t.common.scrollToTop}
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
