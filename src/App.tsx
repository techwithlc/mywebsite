import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Terminal, Code2, Menu, X, ChevronUp, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import axios from 'axios';
import EmbedFacade from './components/EmbedFacade';
import WebsitePreview from './components/WebsitePreview';
import BlogList from './components/BlogList';
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

  const navItems = [
    { label: t.nav.home, href: '#' },
    { label: t.nav.techStack, href: '#tech' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.blog, href: '#blog' },
    { label: t.nav.contact, href: '#contact' }
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
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

  return (
    <div className="min-h-screen bg-white text-gray-900 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_transparent_0%,_rgba(120,119,198,0.05)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_transparent_0%,_rgba(255,255,255,0.8)_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl z-50 border-b border-gray-200/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                TechwithLC
              </span>
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">{t.nav.home}</a>
              <a href="#tech" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">{t.nav.techStack}</a>
              <a href="#projects" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">{t.nav.projects}</a>
              <a href="#blog" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">{t.nav.blog}</a>
              <a href="#contact" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">{t.nav.contact}</a>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Switch */}
              <button 
                onClick={toggleLanguage}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-2 text-sm font-medium text-gray-700"
                aria-label={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
              >
                <span>{language === 'en' ? '中文' : 'EN'}</span>
              </button>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="py-4">
              {navItems.map(item => (
                <a key={item.label}
                   href={item.href}
                   className="block px-6 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors font-medium"
                   onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="relative pt-20">
        {/* Hero Section - Anthropic inspired */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-200 mb-8">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-700 font-medium text-sm">{t.hero.welcome}</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-gray-900 tracking-tight">
                {t.hero.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <a href="#projects" 
                   className="group inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                  <Terminal className="w-5 h-5" />
                  {t.buttons.exploreProjects}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#contact" 
                   className="group inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all">
                  <Mail className="w-5 h-5" />
                  {t.buttons.getInTouch}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech" className="border-t border-gray-200 py-20 bg-gray-50/50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t.techStack.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.techStack.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { 
                    name: 'React', 
                    icon: '⚛️',
                    description: 'Frontend Development'
                  },
                  { 
                    name: 'TypeScript', 
                    icon: '📘',
                    description: 'Type-Safe Code'
                  },
                  { 
                    name: 'AWS', 
                    icon: '☁️',
                    description: 'Cloud Infrastructure'
                  },
                  { 
                    name: 'Azure', 
                    icon: '🌥️',
                    description: 'Cloud Services'
                  },
                  { 
                    name: 'GCP', 
                    icon: '🌐',
                    description: 'Cloud Platform'
                  },
                  { 
                    name: 'Networking', 
                    icon: '🔌',
                    description: 'Infrastructure'
                  },
                  { 
                    name: 'Linux', 
                    icon: '🐧',
                    description: 'System Admin'
                  },
                  { 
                    name: 'AI', 
                    icon: '🤖',
                    description: 'Machine Learning'
                  }
                ].map((tech) => (
                  <div key={tech.name} 
                       className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-200 group cursor-pointer">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                      {tech.icon}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{tech.name}</h3>
                    <p className="text-gray-600 text-sm">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="border-t border-gray-200 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t.projects.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.projects.description}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: t.projects.podcast.title,
                    description: t.projects.podcast.description,
                    tech: ['Podcast', 'Tech Trends', 'Innovation'],
                    spotifyEmbed: true,
                    embedUrl: 'https://open.spotify.com/embed/show/0dfTD5n0Rfuco9z24BhaS0?utm_source=generator',
                    link: undefined
                  },
                  {
                    title: t.projects.youtube.title,
                    description: t.projects.youtube.description,
                    tech: ['YouTube', 'Tech Content', 'Tutorials'],
                    youtubeEmbed: true,
                    embedUrl: latestVideoId 
                      ? `https://www.youtube.com/embed/${latestVideoId}` 
                      : `https://www.youtube.com/embed?listType=user_uploads&list=${YOUTUBE_CHANNEL_USERNAME}`,
                    link: undefined
                  },
                  {
                    title: t.projects.interview.title,
                    description: t.projects.interview.description,
                    tech: ['Career Growth', 'Interview Tips', 'Google'],
                    mediumEmbed: false,
                    link: 'https://medium.com/@awslc/google-%E5%8F%B0%E7%81%A3%E9%9D%A2%E8%A9%A6%E5%88%86%E4%BA%AB-%E7%84%A1%E8%97%8F%E7%A7%81-bd28935d35f3',
                    embedUrl: undefined
                  },
                  {
                    title: t.projects.coffeeLover.title,
                    description: t.projects.coffeeLover.description,
                    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Netlify'],
                    websitePreview: true,
                    link: 'https://coffeelover.fun',
                    embedUrl: undefined
                  }
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
                      <div key={project.title}
                        className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full group">
                        {/* Top Section (Embed/Image) - Using EmbedFacade */}
                        <div className="flex-shrink-0 h-[300px] w-full overflow-hidden">
                          {project.spotifyEmbed ? (
                            <EmbedFacade
                              embedUrl={project.embedUrl}
                              title={project.title}
                              type="spotify"
                            />
                          ) : project.youtubeEmbed ? (
                            <EmbedFacade
                              embedUrl={project.embedUrl}
                              title={project.title}
                              type="youtube"
                            />
                          ) : (
                            // Medium link
                            <a href={project.link}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="block bg-gradient-to-br from-gray-50 to-gray-100 h-full w-full relative group-hover:from-indigo-50 group-hover:to-purple-50 transition-all overflow-hidden flex items-center justify-center">
                              <div className="transition-transform group-hover:scale-110">
                                <svg viewBox="0 0 24 24" className="w-20 h-20 text-gray-600 group-hover:text-indigo-600 transition-colors">
                                  <path
                                    fill="currentColor"
                                    d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"
                                  />
                                </svg>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent">
                                <span className="text-gray-700 font-medium">Read on Medium</span>
                              </div>
                            </a>
                          )}
                        </div>
                        {/* Bottom Section (Text Content) */}
                        <div className="p-6 flex flex-col flex-grow">
                          <a
                            href={project.youtubeEmbed ? 'https://www.youtube.com/@techwithlc' : project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-600 transition-colors"
                          >
                            <h3 className="text-xl font-bold mb-3 text-gray-900 transition-colors">
                              {project.title}
                            </h3>
                          </a>
                          <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                            {project.youtubeEmbed ? t.youtube.description : project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {project.tech.map((tag) => (
                              <span key={tag}
                                    className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-200">
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
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="border-t border-gray-200 py-20 bg-gray-50/50">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t.blog.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.blog.description}
                </p>
              </div>
              <BlogList maxPosts={6} />
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="border-t border-gray-200 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t.newsletter.title}
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                {t.newsletter.description}
              </p>
              
                             <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder={t.newsletter.placeholder}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all whitespace-nowrap"
                >
                  {isSubscribing ? 'Subscribing...' : t.newsletter.button}
                </button>
              </form>
              
              {subscribeMessage && (
                <p className={`mt-4 text-sm ${subscribeSuccess ? 'text-green-600' : 'text-red-600'}`}>
                  {subscribeMessage}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Sponsor Section */}
        <section className="border-t border-gray-200 py-20 bg-gray-50/50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <SponsorSection />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="border-t border-gray-200 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t.contact.title}
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                {t.contact.description}
              </p>
              
              <div className="flex justify-center gap-6">
                <a href="https://github.com/techwithlc" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="p-4 bg-white rounded-2xl hover:shadow-lg transition-all border border-gray-200 hover:border-gray-300 group">
                  <Github className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
                </a>
                <a href="https://www.linkedin.com/in/klunlawrencechen/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-4 bg-white rounded-2xl hover:shadow-lg transition-all border border-gray-200 hover:border-gray-300 group">
                  <Linkedin className="w-6 h-6 text-gray-700 group-hover:text-blue-600" />
                </a>
                <a href="https://x.com/techwithlc0921"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="p-4 bg-white rounded-2xl hover:shadow-lg transition-all border border-gray-200 hover:border-gray-300 group">
                  <svg className="w-6 h-6 text-gray-700 group-hover:text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="mailto:kuanlunlawrence.chen@gmail.com" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-4 bg-white rounded-2xl hover:shadow-lg transition-all border border-gray-200 hover:border-gray-300 group">
                  <Mail className="w-6 h-6 text-gray-700 group-hover:text-indigo-600" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-12 bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  TechwithLC
                </span>
              </div>
              <p className="text-gray-400 mb-8">
                Building the future with technology, one project at a time.
              </p>
              <p className="text-gray-500 text-sm">
                © 2024 TechwithLC. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all hover:shadow-xl z-50"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
