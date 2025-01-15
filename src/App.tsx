import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUp, Github, Linkedin, Share2, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from './config/email';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    try {
      // Track share event
      window.gtag('event', 'share', {
        method: navigator.share ? 'web_share' : 'copy_link',
        content_type: 'website',
        item_id: 'homepage'
      });

      if (navigator.share) {
        await navigator.share({
          title: 'TechwithLC',
          text: 'Building the Future with AI & Cloud Technology',
          url: window.location.href
        });
      } else {
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
              <span className="text-2xl font-bold">TechwithLC</span>
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#232f3e]/95 backdrop-blur-sm z-40">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <a href="#" onClick={() => setIsMenuOpen(false)} className="text-xl hover:text-blue-400 transition-colors">Home</a>
            <a href="#tech" onClick={() => setIsMenuOpen(false)} className="text-xl hover:text-blue-400 transition-colors">Tech Stack</a>
            <a href="#projects" onClick={() => setIsMenuOpen(false)} className="text-xl hover:text-blue-400 transition-colors">Projects</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-xl hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-block px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4">
              <span className="text-blue-400 font-medium">Welcome to TechwithLC</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Building the Future with{' '}
              <span className="bg-gradient-to-br from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                AI & Cloud Technology
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Join me on this journey of innovation and transformation
            </p>
          </div>
        </div>
      </header>

      {/* Rest of your sections... */}

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

        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="bg-blue-500 p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors relative"
          aria-label="Share"
        >
          <Share2 className="w-6 h-6" />
          {showShareTooltip && (
            <div className="absolute bottom-full mb-2 right-0 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
              Copied to clipboard!
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default App;