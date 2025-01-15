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
              <a href="#" className="hover:text-blue-400 transition-colors">Home</a>
              <a href="#tech" className="hover:text-blue-400 transition-colors">Tech Stack</a>
              <a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
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
          <div className="md:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-40">
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <a href="#" 
                 onClick={() => setIsMenuOpen(false)}
                 className="text-xl hover:text-blue-400 transition-colors">
                Home
              </a>
              <a href="#tech" 
                 onClick={() => setIsMenuOpen(false)}
                 className="text-xl hover:text-blue-400 transition-colors">
                Tech Stack
              </a>
              <a href="#projects" 
                 onClick={() => setIsMenuOpen(false)}
                 className="text-xl hover:text-blue-400 transition-colors">
                Projects
              </a>
              <a href="#contact" 
                 onClick={() => setIsMenuOpen(false)}
                 className="text-xl hover:text-blue-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
        )}
      </nav>

      <div className="relative pt-20">
        {/* Hero Section */}
        <header className="container mx-auto px-6 py-16 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-block px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4">
                <span className="text-blue-400 font-medium">Welcome to TechwithLC</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Building the Future with AI & Cloud Technology
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto md:mx-0">
                Join me on this journey of innovation and transformation
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a href="#projects" 
                   className="group bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    Explore Projects
                  </span>
                </a>
                <a href="#contact" 
                   className="group px-8 py-4 rounded-lg font-medium border border-blue-500/50 hover:bg-blue-500/10 transition-all">
                  <span className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Get in Touch
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
              <span className="text-blue-400 font-medium">Tech Stack</span>
              <h2 className="text-3xl font-bold mt-2">What I Use</h2>
              <p className="text-gray-400 mt-4">These are the technologies I'm proficient in.</p>
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
                     className="bg-gray-700/50 p-6 rounded-lg text-center hover:bg-gray-700 transition-all hover:transform hover:scale-105 cursor-pointer group">
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

        {/* Projects Section */}
        <section id="projects" className="border-t border-gray-800/20 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto text-center mb-12">
              <span className="text-blue-400 font-medium">Projects</span>
              <h2 className="text-3xl font-bold mt-2">What I've Built</h2>
              <p className="text-gray-400 mt-4">Here are some of the projects I've worked on.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Podcast Card */}
              <div className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                <iframe 
                  src="https://open.spotify.com/embed/show/0dfTD5n0Rfuco9z24BhaS0" 
                  width="100%" 
                  height="352" 
                  frameBorder="0" 
                  allowFullScreen 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  className="w-full"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">TechwithLC Podcast</h3>
                  <p className="text-gray-300 mb-4">Listen to my podcast where I talk about AI and cloud technology.</p>
                </div>
              </div>

              {/* YouTube Card */}
              <div className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
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
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">TechwithLC YouTube</h3>
                  <p className="text-gray-300 mb-4">Watch my YouTube channel where I talk about AI and cloud technology.</p>
                </div>
              </div>

              {/* Interview Card */}
              <div className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                <a href="https://medium.com/@awslc/google-%E5%8F%B0%E7%81%A3%E9%9D%A2%E8%A9%A6%E5%88%86%E4%BA%AB-%E7%84%A1%E8%97%8F%E7%A7%81-bd28935d35f3"
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="block">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">TechwithLC Interview</h3>
                    <p className="text-gray-300 mb-4">Listen to my interview where I talk about AI and cloud technology.</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="border-t border-gray-800/20 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="text-blue-400 font-medium">Contact</span>
              <h2 className="text-3xl font-bold mt-2">Get in Touch</h2>
              <p className="text-gray-400 mt-4">Feel free to reach out to me.</p>
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
            <div className="max-w-2xl mx-auto bg-gray-800/10 rounded-lg p-8 backdrop-blur-sm">
              <div className="text-center mb-8">
                <span className="text-blue-400 font-medium">Subscribe to My Newsletter</span>
                <p className="text-gray-400 mt-4">Get updates on my latest projects and insights.</p>
              </div>
              <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-blue-500 px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Enhanced Footer with Language Switch */}
        <footer className="border-t border-gray-800/20 py-16">
          <div className="container mx-auto px-6">
            {/* Footer Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="text-lg font-semibold mb-4">Learn</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">What is Cloud</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Cloud Security</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Cloud Architecture</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Cloud Certification</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Tech</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">DevOps</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Containers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">AI</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Machine Learning</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="https://medium.com/@awslc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</a></li>
                  <li><a href="https://www.youtube.com/@techwithlc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">YouTube</a></li>
                  <li><a href="https://open.spotify.com/show/0dfTD5n0Rfuco9z24BhaS0" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">Podcast</a></li>
                  <li><a href="https://github.com/techwithlc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">GitHub</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="#contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</a></li>
                  <li><a href="https://www.linkedin.com/in/klunlawrencechen/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">LinkedIn</a></li>
                  <li><a href="https://github.com/techwithlc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">GitHub</a></li>
                  <li><a href="mailto:kuanlunlawrence.chen@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors">Email</a></li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800/20 pt-8">
              <div className="text-gray-400 text-sm text-center">
                <p>© {new Date().getFullYear()} TechwithLC. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Buttons */}
        <div className="fixed bottom-24 right-8 z-50 flex flex-col gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`bg-blue-500 p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors ${
              showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;