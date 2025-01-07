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
            {['React', 'TypeScript','AWS', 'Azure', 'GCP', 'Networking', 'Linux','AI'].map((tech) => (
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