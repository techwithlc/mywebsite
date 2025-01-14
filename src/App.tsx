import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Terminal, ExternalLink, Code2, Menu, X, ArrowUp, Share2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from './config/email';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', href: '#' },
    { label: 'Tech Stack', href: '#tech' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleFeedbackSubmit = async () => {
    if (!feedbackMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      console.log('Sending feedback with config:', {
        serviceId: EMAIL_CONFIG.SERVICE_ID,
        templateId: EMAIL_CONFIG.TEMPLATE_ID,
        publicKey: EMAIL_CONFIG.PUBLIC_KEY?.slice(0, 5) + '...' // Log only first 5 chars for security
      });

      await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        {
          message: feedbackMessage,
          from_name: 'Website Visitor',
        }
      );
      
      setFeedbackStatus('success');
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackMessage('');
        setFeedbackStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to send feedback:', error);
      setFeedbackStatus('error');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="text-2xl font-bold text-blue-500">TechwithLC</a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <a key={item.label} 
                   href={item.href}
                   className="hover:text-blue-400 transition-colors">
                  {item.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
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

      {/* Add padding to account for fixed navbar */}
      <div className="pt-20">
        {/* Enhanced Hero Section with Animation and Strong CTA */}
        <header className="container mx-auto px-6 py-16 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"></div>
          </div>
          <div className="max-w-4xl mx-auto animate-fadeIn relative">
            <span className="text-blue-400 font-medium mb-4 block">Welcome to TechwithLC</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Building the Future with AI & Cloud Technology
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Join me on this journey of innovation and transformation.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects" 
                 className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg font-medium transition-all hover:transform hover:scale-105 flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Explore Projects
              </a>
              <a href="#contact" 
                 className="border-2 border-blue-500 hover:bg-blue-500/10 px-8 py-4 rounded-lg font-medium transition-all hover:transform hover:scale-105 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Get in Touch
              </a>
            </div>
          </div>
        </header>

        {/* Enhanced Tech Stack Section */}
        <section id="tech" className="bg-gray-800/50 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="text-blue-400 font-medium">Technologies & Skills</span>
              <h2 className="text-3xl font-bold mt-2">Tech Stack</h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Leveraging cutting-edge technologies to build scalable and innovative solutions
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { name: 'React', icon: '⚛️' },
                { name: 'TypeScript', icon: '📘' },
                { name: 'AWS', icon: '☁️' },
                { name: 'Azure', icon: '🌥️' },
                { name: 'GCP', icon: '🌐' },
                { name: 'Networking', icon: '🔌' },
                { name: 'Linux', icon: '🐧' },
                { name: 'AI', icon: '🤖' }
              ].map((tech) => (
                <div key={tech.name} 
                     className="bg-gray-700/50 p-6 rounded-lg text-center hover:bg-gray-700 transition-all hover:transform hover:scale-105 cursor-pointer">
                  <div className="text-2xl mb-2">{tech.icon}</div>
                  <p className="font-medium">{tech.name}</p>
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

        {/* Feedback Modal */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Share Your Feedback</h3>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="w-full h-32 bg-gray-700 rounded-lg p-3 mb-4 text-white"
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
                  disabled={isSubmitting || !feedbackMessage.trim()}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    feedbackStatus === 'success' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : feedbackStatus === 'error'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            </div>
          </div>
        )}

        {/* Featured Projects */}
        <section id="projects" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: 'Podcast - 歐趴',
                  description: '歡迎收聽歐趴，讓你人生一路 All Pa',
                  tech: ['Podcast', 'Tech', 'Oversea'],
                  spotifyEmbed: true,
                  embedUrl: 'https://open.spotify.com/embed/show/0dfTD5n0Rfuco9z24BhaS0?utm_source=generator'
                },
                {
                  title: 'Google 台灣面試分享',
                  description: '分享我在 Google 台灣的面試經驗與心得',
                  tech: ['Career', 'Interview', 'Google'],
                  mediumEmbed: false,
                  link: 'https://medium.com/@awslc/google-%E5%8F%B0%E7%81%A3%E9%9D%A2%E8%A9%A6%E5%88%86%E4%BA%AB-%E7%84%A1%E8%97%8F%E7%A7%81-bd28935d35f3'
                }
              ].map((project) => (
                <div key={project.title} className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform">
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
                  ) : (

                    <a href={project.link} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center justify-center bg-white h-48">
                      <div className="flex flex-col items-center gap-4">
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
                        <span className="text-gray-800 font-medium">Read on Medium</span>
                      </div>
                    </a>
                  )}
                  <div className="p-6">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={!project.spotifyEmbed ? "hover:text-blue-400 transition-colors" : ""}
                    >
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    </a>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
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

        {/* Contact */}
        <section id="contact" className="bg-gray-800/50 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Get in Touch</h2>
            <div className="flex justify-center gap-8">
              <a href="https://github.com/techwithlc" target="_blank" rel="noopener noreferrer" 
                 className="p-4 bg-gray-700/50 rounded-full hover:bg-gray-700 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/klunlawrencechen/" target="_blank" rel="noopener noreferrer"
                 className="p-4 bg-gray-700/50 rounded-full hover:bg-gray-700 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=kuanlunlawrence.chen@gmail.com" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="p-4 bg-gray-700/50 rounded-full hover:bg-gray-700 transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </section>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-500 p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}

        {/* Newsletter Signup */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="bg-gray-800/50 rounded-2xl p-8 max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-gray-300 mb-6">
                Subscribe to my newsletter for the latest tech insights and updates.
              </p>
              <form className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-500 px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Simplified Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-400">
            <p>© {new Date().getFullYear()} TechwithLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;