# TechwithLC Personal Website

A modern, responsive personal website showcasing tech content creation, cloud computing expertise, and professional portfolio.

## 🚀 Features

- **Bilingual Support** - Full English/Chinese language switching
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Interactive UI** - Smooth animations, transitions, and hover effects
- **Content Integration** - Embedded Spotify podcasts, YouTube videos, and Medium articles
- **Contact System** - EmailJS integration for feedback without a backend
- **Dynamic Elements** - Scroll-to-top, social sharing, and feedback modal
- **Newsletter Subscription** - Email collection with AI news summarization and automated delivery
  - **RSS/JSON Feeds** - Subscribe via RSS or JSON feed without requiring email
  - **Webhook Integration** - Trigger newsletter generation and sending via webhooks
  - **Serverless Compatible** - Deploy on Netlify, Vercel, or AWS Lambda without a continuous server

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
    K --> K4[Nodemailer/Resend]
    K --> K5[OpenAI API]
    K --> K6[News API]
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
  - `services/` - Business logic (email, news)
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

1. Create a `.env` file in the server directory based on the `.env.example` template
2. Set up the required environment variables:
   - `RESEND_API_KEY` - Resend API key for sending newsletter emails
   - `OPENAI_API_KEY` - OpenAI API key for news summarization with GPT-4o
   - `NEWS_API_KEY` - News API key for fetching AI articles
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` - SMTP email service credentials
3. Choose your deployment method:
   - **Continuous Server**: Use the provided script: `./run-email-server.sh start`
   - **Serverless Deployment**: Deploy to Netlify, Vercel, or AWS Lambda using the provided configurations
   - **GitHub Actions**: Use the provided workflow file for scheduled newsletter sending
   - **RSS/Webhook**: Allow users to subscribe via RSS and trigger newsletter sending via webhooks

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

1. **Continuous Server Operation**:
   ```bash
   # Navigate to the server directory
   cd server
   
   # Start the email server in continuous mode
   ./run-email-server.sh start
   
   # Check server status
   ./run-email-server.sh status
   ```

2. **Serverless Deployment (Netlify)**:
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

4. **GitHub Actions Automation**:
   - The included GitHub Actions workflow file will automatically:
     - Run every Monday at 9:00 AM UTC
     - Update the RSS and JSON feeds with the latest AI news
     - Send the newsletter to all subscribers
     - Commit and push the updated feeds to your repository

5. **RSS and Webhook Integration**:
   - RSS Feed URL: `https://yourdomain.com/api/feeds/rss`
   - JSON Feed URL: `https://yourdomain.com/api/feeds/json`
   - Webhook URL: `https://yourdomain.com/api/webhook/newsletter?key=YOUR_WEBHOOK_SECRET`
   - Newsletter Subscription Page: `https://yourdomain.com/newsletter`

## 📱 Features Showcase

- **Tech Content Creation** - YouTube tutorials, podcast episodes, and Medium articles
- **Cloud Technology** - AWS, Azure, and GCP expertise
- **Professional Network** - GitHub, LinkedIn, and Twitter integration
- **Bilingual Content** - Supporting both English and Chinese audiences
- **AI Newsletter** - Weekly AI news summaries delivered to subscribers via Resend API

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
- Added newsletter subscription with AI-powered news summarization
- Implemented file-based storage for subscriber management
- Integrated Resend API for reliable email delivery
- Added automated AI news collection and summarization with GPT-4o
- Created scripts for testing and sending newsletters
- Implemented custom continuous email server for reliable operation
- Added RSS and JSON feeds for newsletter subscription without email
- Implemented webhook integration for serverless operation
- Added GitHub Actions workflow for automated newsletter sending
- Created serverless deployment configurations for Netlify and Vercel
- Added comprehensive deployment documentation for various hosting options