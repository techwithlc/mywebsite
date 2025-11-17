import { useState, useEffect } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  Terminal,
  Code2,
  Menu,
  X,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Zap,
  Cpu,
  Rocket,
} from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import axios from 'axios';
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentBlogSlug, setCurrentBlogSlug] = useState<string | null>(null);

  const navItems = [
    { label: t.nav.home, href: '#top' },
    { label: t.nav.techStack, href: '#tech' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.blog, href: '#blog' },
    { label: t.nav.contact, href: '#contact' },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
      
      // Calculate scroll progress for text morphing (0 = AI, 1 = TechwithLC)
      const maxScroll = 800; // Distance to complete the transformation
      const progress = Math.min(window.scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Fetch latest YouTube video using RSS feed
  useEffect(() => {
    const fetchLatestYouTubeVideo = async () => {
      try {
        // Using RSS feed approach to avoid API key requirements
        const response = await axios.get(
          `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UC_qQ8-E8YbRQU8cEOLHtOtw`
        );
        
        if (response.data && response.data.items && response.data.items.length > 0) {
          // Extract video ID from the link
          const videoLink = response.data.items[0].link;
          const videoId = videoLink.split('v=')[1]?.split('&')[0];
          if (videoId) {
            setLatestVideoId(videoId);
          }
        }
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        // Fallback to channel videos if RSS feed fails
        setLatestVideoId('');
      }
    };

    fetchLatestYouTubeVideo();
  }, []);
  
  // --- Subscription Handler using Netlify Function ---
  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubscribing(true);
    setSubscribeMessage('');
    setSubscribeSuccess(false);

    if (!subscribeEmail.trim() || !/\S+@\S+\.\S+/.test(subscribeEmail)) {
      setSubscribeMessage('Please enter a valid email address');
      setSubscribeSuccess(false);
      setIsSubscribing(false);
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: subscribeEmail }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Use message from server response if available, otherwise generic error
        throw new Error(result.message || `Server error: ${response.status}`);
      }

      // Handle success (including already subscribed)
      setSubscribeMessage(result.message);
      setSubscribeSuccess(result.success || false); // Use success flag from server

      if (result.success) {
        setTimeout(() => {
          setSubscribeEmail(''); // Clear email only on successful new subscription or if already subscribed
          setSubscribeMessage('');
        }, 3000);
      }

    } catch (error) {
      console.error('Subscription fetch error:', error);
      setSubscribeMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please check your connection and try again.');
      setSubscribeSuccess(false);
    } finally {
      setIsSubscribing(false);
    }
  };
  // --- End Netlify Function Subscription Handler ---

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Header logo text animation from "TechwithLC" to "AI Tech"
  const getHeaderText = (progress: number) => {
    const startText = "TechwithLC";
    const endText = "AI Tech";
    
    if (progress <= 0) return startText;
    if (progress >= 1) return endText;
    
    // Start transition at 20% scroll, complete by 60%
    if (progress < 0.2) return startText;
    if (progress > 0.6) return endText;
    
    // Smooth transition between 20% and 60%
    const transitionProgress = (progress - 0.2) / 0.4;
    
    // Character-by-character morphing
    if (transitionProgress < 0.5) {
      // First half: gradually remove characters from "TechwithLC"
      const charsToKeep = Math.floor((1 - transitionProgress * 2) * startText.length);
      return charsToKeep < 3 ? "AI" : startText.substring(0, Math.max(charsToKeep, 3));
    } else {
      // Second half: gradually build "AI Tech"
      const charsToShow = Math.floor((transitionProgress - 0.5) * 2 * endText.length);
      return endText.substring(0, Math.max(charsToShow, 2));
    }
  };

  // If viewing a blog post, show detail page
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
    <div id="top" className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Futuristic background: neon grid + orbiting glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950/80" />
        <div className="absolute inset-0 neon-grid opacity-25" />
        <div className="absolute -left-40 top-10 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full animate-pulse-slow" />
        <div className="absolute right-0 -bottom-10 w-[28rem] h-[28rem] bg-fuchsia-500/20 blur-3xl rounded-full animate-pulse-slow delay-150" />
        <div className="absolute inset-0 neon-orbit" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 shadow-[0_0_25px_rgba(56,189,248,0.7)]">
              <Code2 className="h-5 w-5 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
                Future Lab
              </span>
              <span className="text-lg font-semibold text-slate-50 transition-all duration-300 ease-out">
                {getHeaderText(scrollProgress)}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-300 hover:text-cyan-300"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-100 hover:border-cyan-400/70 hover:bg-slate-900"
              aria-label={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
            >
              {language === 'en' ? '中文' : 'EN'}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="rounded-lg border border-slate-700 bg-slate-900/60 p-2 text-slate-100 hover:border-cyan-400/70 hover:bg-slate-900 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-slate-800 bg-slate-950/95 md:hidden">
            <div className="space-y-1 px-6 py-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-cyan-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10 pt-24 md:pt-28">
        {/* Hero Section - Futuristic cockpit */}
        <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-20 pt-10 md:flex-row md:items-center md:pt-16 lg:gap-16">
          {/* Left: Copy */}
          <div className="relative flex-1 space-y-7 animate-fadeIn">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-900/80 px-3 py-1 text-xs text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.35)]">
              <Sparkles className="h-3 w-3" />
              <span className="uppercase tracking-[0.2em]">
                {t.hero.welcome}
              </span>
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-slate-50 md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                {t.hero.title}
              </span>
              <span className="mt-2 block text-slate-300">
                AI × Cloud × Developer Stories
              </span>
            </h1>

            <p className="max-w-xl text-balance text-base text-slate-300/80 md:text-lg">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <a
                href="#projects"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,0.6)]"
              >
                <Terminal className="h-4 w-4" />
                {t.buttons.exploreProjects}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/70 px-6 py-3 text-sm font-semibold text-slate-100 hover:border-cyan-400/80 hover:bg-slate-900"
              >
                <Mail className="h-4 w-4" />
                {t.buttons.getInTouch}
              </a>
            </div>

            {/* Mini stat chips */}
            <div className="mt-6 grid max-w-md grid-cols-3 gap-3 text-xs text-slate-300/80">
              <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
                <span className="flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-cyan-300">
                  <Zap className="h-3 w-3" /> AI
                </span>
                <p className="mt-1 text-[0.78rem] leading-snug">
                  Practical AI workflows & tools you can ship today.
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
                <span className="flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-fuchsia-300">
                  <Cpu className="h-3 w-3" /> Cloud
                </span>
                <p className="mt-1 text-[0.78rem] leading-snug">
                  AWS / Azure / GCP infra stories from the trenches.
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
                <span className="flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-emerald-300">
                  <Rocket className="h-3 w-3" /> Career
                </span>
                <p className="mt-1 text-[0.78rem] leading-snug">
                  Big tech interviews, growth, and behind-the-scenes.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Animated dashboard */}
          <div className="relative flex-1 animate-slideUp">
            <div className="relative mx-auto max-w-md">
              <div className="glassy-panel relative rounded-3xl border border-cyan-400/40 bg-slate-950/60 p-4 shadow-[0_0_45px_rgba(56,189,248,0.6)]">
                <div className="mb-3 flex items-center justify-between text-xs text-slate-300/80">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE AI DASHBOARD
                  </span>
                  <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.18em] text-slate-400">
                    v2025
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                  <div className="neon-scanline pointer-events-none absolute inset-0" />
                  <div className="relative grid grid-cols-2 gap-4 p-4 text-xs">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
                          NEXT EPISODE
                        </p>
                        <p className="mt-1 text-[0.8rem] font-semibold text-slate-100">
                          AI News & Infra Roundup
                        </p>
                      </div>
                      <div>
                        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
                          CHANNEL
                        </p>
                        <p className="mt-1 text-[0.8rem] text-slate-200">@techwithlc</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="inline-flex flex-1 items-center justify-between rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-1">
                          <span className="text-[0.7rem] text-emerald-100">Ship Rate</span>
                          <span className="text-[0.8rem] font-semibold text-emerald-300">
                            99.9%
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
                          AI SIGNAL
                        </p>
                        <div className="mt-2 flex h-14 items-end gap-1">
                          {[40, 60, 90, 70, 50].map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${h}%` }}
                              className="w-1.5 rounded-t-full bg-gradient-to-t from-slate-700 via-cyan-400 to-fuchsia-400 animate-pulse-bar"
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
                          FEED
                        </p>
                        <p className="mt-1 text-[0.78rem] text-slate-300/80">
                          Latest YouTube episode auto-synced into the projects
                          section below.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating chips */}
                <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem]">
                  <span className="rounded-full border border-cyan-400/60 bg-cyan-500/10 px-3 py-1 text-cyan-100">
                    React · TypeScript · Tailwind
                  </span>
                  <span className="rounded-full border border-fuchsia-400/60 bg-fuchsia-500/10 px-3 py-1 text-fuchsia-100">
                    AI Workflows
                  </span>
                  <span className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-emerald-100">
                    Cloud Infra
                  </span>
                </div>
              </div>

              {/* Orbiting rings */}
              <div className="pointer-events-none absolute -inset-10 -z-10 neon-orbit subtle-spin" />
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech" className="border-t border-slate-800/70 bg-slate-950/80 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
                STACK TELEMETRY
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-50 md:text-4xl">
                {t.techStack.title}
              </h2>
              <p className="mt-3 text-base text-slate-300/80 md:text-lg">
                {t.techStack.description}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                {
                  name: 'React',
                  icon: '⚛️',
                  description: 'Frontend Systems',
                },
                {
                  name: 'TypeScript',
                  icon: '📘',
                  description: 'Static Safety',
                },
                {
                  name: 'AWS',
                  icon: '☁️',
                  description: 'Scalable Infra',
                },
                {
                  name: 'Azure',
                  icon: '🌥️',
                  description: 'Enterprise Cloud',
                },
                {
                  name: 'GCP',
                  icon: '🌐',
                  description: 'Data & ML',
                },
                {
                  name: 'Networking',
                  icon: '🔌',
                  description: 'Deep Infrastructure',
                },
                {
                  name: 'Linux',
                  icon: '🐧',
                  description: 'Systems Engineering',
                },
                {
                  name: 'AI',
                  icon: '🤖',
                  description: 'Agents & LLMs',
                },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-card hover:border-cyan-400/70 hover:shadow-[0_0_35px_rgba(56,189,248,0.55)]"
                >
                  <div className="pointer-events-none absolute inset-px rounded-2xl border border-slate-700/50 group-hover:border-cyan-400/40" />
                  <div className="relative">
                    <div className="mb-3 text-2xl transition-transform duration-300 group-hover:scale-110">
                      {tech.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100">
                      {tech.name}
                    </h3>
                    <p className="mt-1 text-[0.78rem] text-slate-400">
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="border-t border-slate-800/70 bg-slate-950/90 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
                SIGNAL STREAMS
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-50 md:text-4xl">
                {t.projects.title}
              </h2>
              <p className="mt-3 text-base text-slate-300/80 md:text-lg">
                {t.projects.description}
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: t.projects.podcast.title,
                  description: t.projects.podcast.description,
                  tech: ['Podcast', 'Tech Trends', 'Innovation'],
                  spotifyEmbed: true,
                  embedUrl:
                    'https://open.spotify.com/embed/show/0dfTD5n0Rfuco9z24BhaS0?utm_source=generator',
                  link: undefined,
                },
                {
                  title: t.projects.youtube.title,
                  description: t.projects.youtube.description,
                  tech: ['YouTube', 'Tech Content', 'Tutorials'],
                  youtubeEmbed: true,
                  embedUrl: latestVideoId
                    ? `https://www.youtube.com/embed/${latestVideoId}`
                    : `https://www.youtube.com/embed?listType=user_uploads&list=${YOUTUBE_CHANNEL_USERNAME}`,
                  link: undefined,
                },
                {
                  title: t.projects.interview.title,
                  description: t.projects.interview.description,
                  tech: ['Career Growth', 'Interview Tips', 'Google'],
                  mediumEmbed: false,
                  link: 'https://medium.com/@awslc/google-%E5%8F%B0%E7%81%A3%E9%9D%A2%E8%A9%A6%E5%88%86%E4%BA%AB-%E7%84%A1%E8%97%8F%E7%A7%81-bd28935d35f3',
                  embedUrl: undefined,
                },
                {
                  title: t.projects.coffeeLover.title,
                  description: t.projects.coffeeLover.description,
                  tech: ['React', 'TypeScript', 'Tailwind CSS', 'Netlify'],
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
                } else {
                  return (
                    <div
                      key={project.title}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 shadow-card hover:border-cyan-400/70 hover:shadow-[0_0_35px_rgba(56,189,248,0.55)]"
                    >
                      {/* Top Section (Embed/Image) - Using EmbedFacade */}
                      <div className="relative h-[260px] w-full flex-shrink-0 overflow-hidden">
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
                          // Medium link
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800"
                          >
                            <div className="transition-transform duration-500 group-hover:scale-110">
                              <svg
                                viewBox="0 0 24 24"
                                className="h-16 w-16 text-slate-300 group-hover:text-cyan-300"
                              >
                                <path
                                  fill="currentColor"
                                  d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"
                                />
                              </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 to-transparent p-3">
                              <span className="text-[0.75rem] font-medium text-slate-100">
                                Read on Medium
                              </span>
                            </div>
                          </a>
                        )}
                      </div>
                      {/* Bottom Section (Text Content) */}
                      <div className="flex flex-grow flex-col p-4">
                        <a
                          href={
                            project.youtubeEmbed
                              ? 'https://www.youtube.com/@techwithlc'
                              : project.link
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-cyan-300"
                        >
                          <h3 className="mb-2 text-sm font-semibold text-slate-50">
                            {project.title}
                          </h3>
                        </a>
                        <p className="mb-4 flex-grow text-[0.8rem] leading-relaxed text-slate-300/80">
                          {project.youtubeEmbed ? t.youtube.description : project.description}
                        </p>
                        <div className="mt-auto flex flex-wrap gap-1.5">
                          {project.tech.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[0.7rem] text-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="border-t border-slate-800/70 bg-slate-950/80 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
                DEV LOG
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-50 md:text-4xl">
                {t.blog.title}
              </h2>
              <p className="mt-3 text-base text-slate-300/80 md:text-lg">
                {t.blog.description}
              </p>
            </div>
            <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-card">
              <BlogList maxPosts={6} />
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="border-t border-slate-800/70 bg-slate-950/90 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
                HYPERFEED
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-50 md:text-4xl">
                {t.newsletter.title}
              </h2>
              <p className="mt-3 text-base text-slate-300/80 md:text-lg">
                {t.newsletter.description}
              </p>

              <form
                onSubmit={handleSubscribe}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder={t.newsletter.placeholder}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.6)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] disabled:opacity-60"
                >
                  {isSubscribing ? 'Subscribing...' : t.newsletter.button}
                </button>
              </form>

              {subscribeMessage && (
                <p
                  className={`mt-3 text-xs ${
                    subscribeSuccess ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {subscribeMessage}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Sponsor Section */}
        <section className="border-t border-slate-800/70 bg-slate-950/80 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-card">
              <SponsorSection />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="border-t border-slate-800/70 bg-slate-950/90 py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
              CONTACT
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-50 md:text-4xl">
              {t.contact.title}
            </h2>
            <p className="mt-3 text-base text-slate-300/80 md:text-lg">
              {t.contact.description}
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <a
                href="https://github.com/techwithlc"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-slate-100 hover:border-cyan-400/80 hover:bg-slate-900"
              >
                <Github className="h-5 w-5 text-slate-300 group-hover:text-cyan-300" />
              </a>
              <a
                href="https://www.linkedin.com/in/klunlawrencechen/"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-slate-100 hover:border-cyan-400/80 hover:bg-slate-900"
              >
                <Linkedin className="h-5 w-5 text-slate-300 group-hover:text-sky-400" />
              </a>
              <a
                href="https://x.com/techwithlc0921"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-slate-100 hover:border-cyan-400/80 hover:bg-slate-900"
              >
                <svg
                  className="h-5 w-5 text-slate-300 group-hover:text-slate-50"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="mailto:kuanlunlawrence.chen@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-slate-100 hover:border-cyan-400/80 hover:bg-slate-900"
              >
                <Mail className="h-5 w-5 text-slate-300 group-hover:text-cyan-300" />
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-950 py-10">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="mb-5 flex items-center justify-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-fuchsia-500 shadow-[0_0_25px_rgba(56,189,248,0.7)]">
                <Code2 className="h-5 w-5 text-slate-950" />
              </div>
              <span className="text-lg font-semibold text-slate-50">
                TechwithLC
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Building the future with technology, one experiment at a time.
            </p>
            <p className="mt-2 text-[0.7rem] text-slate-500">
              © 2025 TechwithLC. All rights reserved.
            </p>
          </div>
        </footer>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900/90 p-3 text-slate-50 shadow-[0_0_25px_rgba(15,23,42,0.9)] ring-1 ring-slate-700 hover:bg-slate-900 hover:ring-cyan-400/80"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
