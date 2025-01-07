import React from 'react';
import { Github, Linkedin, Mail, Terminal, ExternalLink, Code2 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 md:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Building the Future with AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Cloud computing trailblazer passionate about driving innovation and transforming the future of technology.
          </p>
          <div className="flex gap-4">
            <a href="#contact" className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium transition-colors">
              Get in Touch
            </a>
            <a href="#projects" className="border border-gray-600 hover:border-blue-500 px-6 py-3 rounded-lg font-medium transition-colors">
              View Projects
            </a>
          </div>
        </div>
      </header>

      {/* Tech Stack */}
      <section className="bg-gray-800/50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {['React', 'TypeScript', 'Node.js', 'AWS', 'Azure', 'GCP', 'Networking', 'Linux','AI'].map((tech) => (
              <div key={tech} className="bg-gray-700/50 p-6 rounded-lg text-center hover:bg-gray-700 transition-colors">
                <p className="font-medium">{tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                mediumEmbed: true,
                embedUrl: 'https://medium.com/embed/@awslc/google-%E5%8F%B0%E7%81%A3%E9%9D%A2%E8%A9%A6%E5%88%86%E4%BA%AB-%E7%84%A1%E8%97%8F%E7%A7%81-bd28935d35f3'
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
                ) : project.mediumEmbed ? (
                  <iframe 
                    src={project.embedUrl}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowFullScreen
                    loading="lazy"
                    className="w-full"
                  />
                ) : (
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
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
            <a href="kuanlunlawrence.chen@gmail.com"
               className="p-4 bg-gray-700/50 rounded-full hover:bg-gray-700 transition-colors">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 mt-20">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} TechwithLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;