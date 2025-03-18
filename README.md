# TechwithLC Personal Website

A modern, responsive personal website showcasing tech content creation, cloud computing expertise, and professional portfolio.

## 🚀 Features

- **Bilingual Support** - Full English/Chinese language switching
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Interactive UI** - Smooth animations, transitions, and hover effects
- **Content Integration** - Embedded Spotify podcasts, YouTube videos, and Medium articles
- **Contact System** - EmailJS integration for feedback without a backend
- **Dynamic Elements** - Scroll-to-top, social sharing, and feedback modal
- **Newsletter Signup** - Email collection form for content updates

## 🛠️ Tech Stack

```mermaid
flowchart TD
    A[TechwithLC Website] --> B[Frontend]
    B --> C[React 18]
    B --> D[TypeScript]
    B --> E[Vite]
    B --> F[TailwindCSS]
    
    B --> G[Component Architecture]
    G --> G1[App Component]
    G1 --> G2[Navigation]
    G1 --> G3[Hero Section]
    G1 --> G4[Tech Stack]
    G1 --> G5[Projects]
    G1 --> G6[Contact]
    G1 --> G7[Newsletter]
    G1 --> G8[Footer]
    
    B --> H[Libraries]
    H --> H1[EmailJS]
    H --> H2[Lucide Icons]
    
    B --> I[State Management]
    I --> I1[Language Context]
    I --> I2[UI State Hooks]
    
    B --> J[Deployment]
    J --> J1[Netlify]
```

## 📦 Project Structure

- `src/` - Source code
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
  - `contexts/` - React contexts (Language)
  - `config/` - Configuration files
- `public/` - Static assets
- `dist/` - Build output

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Features Showcase

- **Tech Content Creation** - YouTube tutorials, podcast episodes, and Medium articles
- **Cloud Technology** - AWS, Azure, and GCP expertise
- **Professional Network** - GitHub, LinkedIn, and Twitter integration
- **Bilingual Content** - Supporting both English and Chinese audiences

## 📞 Contact

- LinkedIn: [klunlawrencechen](https://www.linkedin.com/in/klunlawrencechen/)
- GitHub: [techwithlc](https://github.com/techwithlc)
- Twitter: [techwithlc0921](https://x.com/techwithlc0921)
- Email: kuanlunlawrence.chen@gmail.com

## 🌟 Recent Updates

- Added scroll-to-top button with animation
- Fixed footer area
- Added X (Twitter) to contact area
- Fixed button errors