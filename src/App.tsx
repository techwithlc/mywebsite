import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Terminal, Code2, Menu, X, Share2, ChevronUp } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG, validateEmailConfig } from './config/email';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { t, language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const navItems = [
    { label: 'Home', href: '#' },
    { label: 'Tech Stack', href: '#tech' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' }
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
    
    // Initialize emailjs with more robust error handling
    try {
      if (EMAIL_CONFIG.PUBLIC_KEY) {
        emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
        console.log('EmailJS initialized successfully');
      }
    } catch (error) {
      console.warn('EmailJS initialization failed:', error);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFeedbackSubmit = async () => {
    try {
      // Use the validateEmailConfig function to check configuration
      if (!validateEmailConfig()) {
        throw new Error('EmailJS configuration missing');
      }
      
      if (!feedbackMessage.trim()) {
        setFeedbackStatus('error');
        setErrorMessage('Please enter a message');
        return;
      }

      setIsSubmitting(true);
      
      // Use fetch API instead of emailjs.send for better mobile compatibility
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAIL_CONFIG.SERVICE_ID,
          template_id: EMAIL_CONFIG.TEMPLATE_ID,
          user_id: EMAIL_CONFIG.PUBLIC_KEY,
          template_params: {
            message: feedbackMessage,
            from_name: 'Website Visitor',
            reply_to: 'noreply@techwithlc.com'
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Feedback submission failed');
      }

      setFeedbackStatus('success');
      setErrorMessage('Feedback sent successfully!');
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackMessage('');
      }, 2000);
    } catch (error) {
      console.error('Feedback submission error:', error);
      setFeedbackStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setFeedbackStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'TechwithLC',
      text: 'Building the Future with AI & Cloud Technology',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(window.location.href);
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubscribing(true);
    try {
      // Use the validateEmailConfig function to check configuration
      if (!validateEmailConfig()) {
        throw new Error('EmailJS configuration missing');
      }
      
      if (!subscribeEmail.trim()) {
        setSubscribeMessage('Please enter a valid email address');
        setSubscribeSuccess(false);
        setIsSubscribing(false);
        return;
      }

      // Use fetch API instead of EmailJS for better mobile compatibility
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAIL_CONFIG.SERVICE_ID,
          template_id: EMAIL_CONFIG.TEMPLATE_ID,
          user_id: EMAIL_CONFIG.PUBLIC_KEY,
          template_params: {
            email: subscribeEmail,
            from_name: 'Newsletter Subscriber',
            reply_to: 'noreply@techwithlc.com'
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Subscription request failed');
      }

      setSubscribeMessage('Subscription successful!');
      setSubscribeSuccess(true);
      setTimeout(() => {
        setSubscribeEmail('');
        setSubscribeMessage('');
      }, 2000);
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again later.');
      setSubscribeSuccess(false);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#232f3e] text-white relative overflow-hidden">
      {/* Subtle background lighting effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#232f3e]/95 backdrop-blur-sm z-50 border-b border-gray-800/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                TechwithLC
              </span>
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="hover:text-blue-400 transition-colors">{t.nav.home}</a>
              <a href="#tech" className="hover:text-blue-400 transition-colors">{t.nav.techStack}</a>
              <a href="#projects" className="hover:text-blue-400 transition-colors">{t.nav.projects}</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">{t.nav.contact}</a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Language Switch - Now in Navigation */}
            <button 
              onClick={toggleLanguage}
              className="px-4 py-2 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all flex items-center gap-2"
              aria-label={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
            >
              <span>{language === 'en' ? 'Chinese' : 'English'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 py-4">
            {navItems.map(item => (
              <a key={item.label}
                 href={item.href}
                 className="block px-6 py-2 hover:bg-gray-700"
                 onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <div className="relative pt-20">
        {/* Hero Section */}
        <header className="container mx-auto px-6 py-16 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-block px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4">
                <span className="text-blue-400 font-medium">{t.hero.welcome}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {t.hero.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto md:mx-0">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a href="#projects" 
                   className="group bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    {t.buttons.exploreProjects}
                  </span>
                </a>
                <a href="#contact" 
                   className="group px-8 py-4 rounded-lg font-medium border border-blue-500/50 hover:bg-blue-500/10 transition-all">
                  <span className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    {t.buttons.getInTouch}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Sections with consistent styling */}
        <section id="tech" className="border-t border-gray-800/20 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="text-blue-400 font-medium">{t.techStack.subtitle}</span>
              <h2 className="text-3xl font-bold mt-2">{t.techStack.title}</h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                {t.techStack.description}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
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
                     className="bg-gray-700/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/10">
                  <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">
                    {tech.icon}
                  </div>
                  <h3 className="font-medium text-lg mb-1">{tech.name}</h3>
                  <p className="text-sm text-gray-400">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Share Floating Button */}
        <div className="fixed bottom-24 right-8 z-50">
          <button 
            onClick={handleShare}
            className="bg-blue-500 p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors relative"
            aria-label="Share"
          >
            <Share2 className="w-6 h-6" />
          </button>
          {showShareTooltip && (
            <div className="absolute bottom-full mb-2 right-0 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
              Copied to clipboard!
            </div>
          )}
        </div>

        {/* Feedback Button */}
        <button
          onClick={() => setShowFeedback(true)}
          className="fixed bottom-40 right-8 bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
          aria-label="Give Feedback"
        >
          <Mail className="w-6 h-6" />
        </button>
        
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-56 right-8 bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-600 transition-all hover:transform hover:scale-110 z-50 animate-fadeIn"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}

        {/* Feedback Modal */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Share Your Feedback</h3>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="w-full bg-gray-700/50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your feedback helps me improve..."
                disabled={isSubmitting}
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowFeedback(false)}
                  className="px-4 py-2 rounded-lg hover:bg-gray-700"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  className={`px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 ${
                    feedbackStatus === 'success'
                      ? 'bg-green-500 hover:bg-green-600'
                      : feedbackStatus === 'error'
                      ? 'bg-red-500 hover:bg-red-600'
                      : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-block animate-spin">⌛</span>
                  ) : feedbackStatus === 'success' ? (
                    'Sent!'
                  ) : feedbackStatus === 'error' ? (
                    'Failed to send'
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
              {errorMessage && (
                <p className={`text-sm mt-4 ${feedbackStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {errorMessage}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Projects Section */}
        <section id="projects" className="border-t border-gray-800/20 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto text-center mb-12">
              <span className="text-blue-400 font-medium">{t.projects.subtitle}</span>
              <h2 className="text-3xl font-bold mt-2">{t.projects.title}</h2>
              <p className="text-gray-400 mt-4">
                {t.projects.description}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: 'Tech Podcast - 歐趴',
                  description: '探索科技趨勢，分享創新思維。歡迎收聽歐趴，讓你人生一路 All Pa',
                  tech: ['Podcast', 'Tech Trends', 'Innovation'],
                  spotifyEmbed: true,
                  embedUrl: 'https://open.spotify.com/embed/show/0dfTD5n0Rfuco9z24BhaS0?utm_source=generator'
                },
                {
                  title: 'TechwithLC YouTube',
                  description: 'Tech tutorials, cloud computing insights, and career development tips',
                  tech: ['YouTube', 'Tech Content', 'Tutorials'],
                  youtubeEmbed: true,
                  embedUrl: 'https://www.youtube.com/embed/?listType=user_uploads&list=@techwithlc'
                },
                {
                  title: 'Google Taiwan Interview Experience',
                  description: '深入分享 Google 台灣的面試過程與寶貴經驗',
                  tech: ['Career Growth', 'Interview Tips', 'Google'],
                  mediumEmbed: false,
                  link: 'https://medium.com/@awslc/google-%E5%8F%B0%E7%81%A3%E9%9D%A2%E8%A9%A6%E5%88%86%E4%BA%AB-%E7%84%A1%E8%97%8F%E7%A7%81-bd28935d35f3'
                }
              ].map((project) => (
                <div key={project.title} 
                     className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/10">
                  {project.spotifyEmbed ? (
                    <iframe 
                      src={project.embedUrl}
                      width="100%" 
                      height="352" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy"
                      className="w-full"
                    />
                  ) : project.youtubeEmbed ? (
                    <iframe
                      src="https://www.youtube.com/embed/?listType=user_uploads&list=@techwithlc"
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      loading="lazy"
                      className="w-full"
                    />
                  ) : (
                    <a href={project.link} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="block bg-gradient-to-br from-gray-100 to-white h-48 relative group overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center transition-transform group-hover:scale-110">
                        <svg viewBox="0 0 24 24" className="w-20 h-20">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                          />
                          <path
                            fill="#34A853"
                            d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                          />
                        </svg>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
                        <span className="text-gray-800 font-medium">Read on Medium</span>
                      </div>
                    </a>
                  )}
                  <div className="p-6">
                    <a 
                      href={project.youtubeEmbed ? 'https://www.youtube.com/@techwithlc' : project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors"
                    >
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                    </a>
                    <p className="text-gray-300 mb-4">
                      {project.youtubeEmbed ? t.youtube.description : project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} 
                              className="bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="border-t border-gray-800/20 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="text-blue-400 font-medium">{t.contact.subtitle}</span>
              <h2 className="text-3xl font-bold mt-2">{t.contact.title}</h2>
              <p className="text-gray-400 mt-4">
                {t.contact.description}
              </p>
            </div>
            <div className="flex justify-center gap-6">
              <a href="https://github.com/techwithlc" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="p-4 bg-gray-700/50 rounded-full hover:bg-gray-700 transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/10">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/klunlawrencechen/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="p-4 bg-gray-700/50 rounded-full hover:bg-gray-700 transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/10">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://x.com/techwithlc0921"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="p-4 bg-gray-700/50 rounded-full hover:bg-gray-700 transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/10">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=kuanlunlawrence.chen@gmail.com" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="p-4 bg-gray-700/50 rounded-full hover:bg-gray-700 transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/10">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="border-t border-gray-800/20 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="text-blue-400 font-medium">{t.newsletter.title}</span>
              <h2 className="text-3xl font-bold mt-2">{t.newsletter.subtitle}</h2>
              <p className="text-gray-400 mt-4">
                {t.newsletter.description}
              </p>
            </div>
            
            {/* Email Subscription Form */}
            <div className="max-w-2xl mx-auto bg-gray-800/10 rounded-lg p-6 sm:p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Subscribe to AI News</h3>
              <p className="text-gray-300 mb-6">
                Get the latest AI news and updates delivered directly to your inbox.
              </p>
              
              <form 
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  inputMode="email"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 rounded-lg font-medium hover:bg-blue-600 transition-all active:bg-blue-700"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
              
              {subscribeMessage && (
                <div className={`mt-4 p-3 rounded ${
                  subscribeSuccess ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"
                }`}>
                  {subscribeMessage}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Enhanced Footer with Language Switch */}
        <footer className="border-t border-gray-800/20 py-16">
          <div className="container mx-auto px-6">
            {/* Footer Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="text-lg font-semibold mb-4">{t.footer.learn.title}</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.learn.whatIsCloud}</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.learn.cloudSecurity}</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.learn.cloudArchitecture}</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.learn.cloudCertification}</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{t.footer.tech.title}</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.tech.devops}</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.tech.containers}</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.tech.ai}</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.tech.ml}</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{t.footer.resources.title}</h3>
                <ul className="space-y-2">
                  <li><a href="https://medium.com/@awslc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.resources.blog}</a></li>
                  <li><a href="https://www.youtube.com/@techwithlc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.resources.youtube}</a></li>
                  <li><a href="https://open.spotify.com/show/0dfTD5n0Rfuco9z24BhaS0" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.resources.podcast}</a></li>
                  <li><a href="https://github.com/techwithlc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.resources.github}</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{t.footer.connect.title}</h3>
                <ul className="space-y-2">
                  <li><a href="https://www.linkedin.com/in/klunlawrencechen/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.connect.linkedin}</a></li>
                  <li><a href="https://github.com/techwithlc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.connect.github}</a></li>
                  <li><a href="https://x.com/techwithlc0921" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.connect.twitter}</a></li>
                  <li><a href="mailto:kuanlunlawrence.chen@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors">{t.footer.connect.email}</a></li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800/20 pt-8">
              <div className="text-gray-400 text-sm text-center">
                <p>&copy; {new Date().getFullYear()} TechwithLC. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;