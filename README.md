# TechwithLC Personal Website

A modern, responsive personal website showcasing tech content creation, cloud computing expertise, and professional portfolio.

## 🚀 Features

- **Bilingual Support** - Full English/Chinese language switching
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Interactive UI** - Smooth animations, transitions, and hover effects
- **Content Integration** - Embedded Spotify podcasts, YouTube videos, and Medium articles
- **Contact System** - EmailJS integration for feedback without a backend
- **Dynamic Elements** - Scroll-to-top, social sharing, and feedback modal
- **AI Newsletter** - AI news summarization delivered directly via email (using Gmail)

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
    
    A --> K[Backend]
    K --> K1[Node.js]
    K --> K2[Express]
    K --> K3[File Storage]
    K --> K4[Google Gemini API]
    K --> K5[News API]
```

## 📦 Project Structure

- `src/` - Source code
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
  - `contexts/` - React contexts (Language)
  - `config/` - Configuration files
- `public/` - Static assets
- `server/` - Backend services
  - `index.js` - Express server setup
  - `routes/` - API endpoints
  - `services/` - Business logic (news)
  - `.env.example` - Environment variables template
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

# Start backend server
cd server
npm install
npm run dev
```

## 🔧 Backend Setup

1. Create a `.env` file in the `server` directory based on the `server/env-setup-instructions.md` guide.
2. Set up the required environment variables, including:
   - `GOOGLE_GEMINI_API_KEY` - Google Gemini API key for news summarization.
   - `NEWS_API_KEY` - News API key for fetching AI articles.
   - `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_SERVICE` - Credentials for sending emails (e.g., Gmail App Password).
   - `RECIPIENT_EMAIL` - Email address to send the newsletter to.
3. Choose your deployment method:
   - **Manual Execution**: Run `node server/send-newsletter-now.js` to generate and send immediately.
   - **Scheduled Execution (e.g., cron)**: Set up a scheduler to run `node server/send-newsletter.js` periodically.
   - **GitHub Actions**: Use the provided workflow file for scheduled RSS feed updates (Note: Email sending might require adjustments for Actions environment).
   - **Serverless Deployment**: Deploy to Netlify or Vercel using the provided configurations

## 🚀 Production Deployment

### Frontend Deployment

The frontend is deployed on Netlify:

1. Build the frontend for production:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to Netlify:
   - Connect your GitHub repository to Netlify
   - Set the build command to `npm run build`
   - Set the publish directory to `dist`

### Backend Deployment

Choose one of the following deployment options based on your needs:

1. **Scheduled Execution (e.g., cron or server process manager like PM2)**:
   - Run `node server/send-newsletter.js` periodically to generate and send the newsletter via email.

2. **Manual Execution**:
   - Run `node server/send-newsletter-now.js` to generate and send immediately.

3. **GitHub Actions Automation**:
   - The included GitHub Actions workflow file can be adapted for scheduled execution, but secure handling of email credentials (`EMAIL_USER`, `EMAIL_PASS`) within Actions requires careful setup using GitHub Secrets. Direct email sending from Actions might be complex.

4. **Serverless Deployment (Netlify)**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy to Netlify
   cd server
   netlify deploy --prod
   ```

3. **Serverless Deployment (Vercel)**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy to Vercel
   cd server
   vercel --prod
   ```

## 📱 Features Showcase

- **Tech Content Creation** - YouTube tutorials, podcast episodes, and Medium articles
- **Cloud Technology** - AWS, Azure, and GCP expertise
- **Professional Network** - GitHub, LinkedIn, and Twitter integration
- **Bilingual Content** - Supporting both English and Chinese audiences
- **AI Newsletter** - Weekly AI news summaries delivered directly via email

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
- Implemented RSS feed for AI news updates
- Integrated OpenAI's GPT-4o for AI news summarization (Now Refactored)
- Created GitHub Actions workflow for automated RSS feed updates
- Added mobile-friendly subscription page with QR code
- Created serverless deployment configurations for Netlify and Vercel
- Added comprehensive deployment documentation for various hosting options
- **Refactored newsletter generation to use Google Gemini API**
- **Removed local subscriber file (`server/subscribers.json`)**
- **Switched newsletter delivery from RSS feed to direct email (Gmail)**
