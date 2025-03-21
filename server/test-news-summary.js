import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI client with the provided API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Mock news articles for testing
const mockArticles = [
  {
    title: "OpenAI Releases GPT-5 with Unprecedented Reasoning Capabilities",
    source: { name: "Tech Chronicle" },
    publishedAt: new Date().toISOString(),
    url: "https://example.com/openai-gpt5",
    content: "OpenAI has announced the release of GPT-5, featuring significant improvements in reasoning, planning, and multimodal understanding. The new model demonstrates human-level performance across various benchmarks and shows enhanced capabilities in complex problem-solving tasks."
  },
  {
    title: "AI Regulation Framework Adopted by European Union",
    source: { name: "EU Policy News" },
    publishedAt: new Date().toISOString(),
    url: "https://example.com/eu-ai-regulation",
    content: "The European Union has officially adopted a comprehensive AI regulation framework that categorizes AI systems based on risk levels and imposes varying degrees of oversight. High-risk applications will require rigorous testing and transparency measures before deployment."
  },
  {
    title: "Breakthrough in AI-Powered Drug Discovery Leads to New Cancer Treatment",
    source: { name: "Medical Innovation Today" },
    publishedAt: new Date().toISOString(),
    url: "https://example.com/ai-drug-discovery",
    content: "Researchers have used AI to discover a novel compound that shows promise in treating resistant forms of lung cancer. The AI system analyzed millions of potential molecular structures and predicted their efficacy, significantly accelerating the drug discovery process."
  },
  {
    title: "Autonomous Vehicles Reach New Milestone with Cross-Country Journey",
    source: { name: "Future Transport" },
    publishedAt: new Date().toISOString(),
    url: "https://example.com/autonomous-vehicles",
    content: "A self-driving car has successfully completed a coast-to-coast journey across the United States without human intervention. The vehicle navigated diverse weather conditions, traffic scenarios, and road types using advanced AI systems and sensor fusion technology."
  },
  {
    title: "AI Ethics Board Established by Major Tech Companies",
    source: { name: "Tech Policy Review" },
    publishedAt: new Date().toISOString(),
    url: "https://example.com/ai-ethics-board",
    content: "Leading technology companies have jointly established an independent AI ethics board to develop industry standards for responsible AI development and deployment. The board includes experts from diverse fields including computer science, ethics, law, and social sciences."
  }
];

/**
 * Use OpenAI to summarize news articles
 */
async function summarizeNewsWithOpenAI(articles) {
  try {
    // Format articles for OpenAI
    const articlesText = articles.map((article, index) => {
      return `Article ${index + 1}: "${article.title}"
Source: ${article.source.name}
Published: ${new Date(article.publishedAt).toLocaleDateString()}
URL: ${article.url}
Content: ${article.content || article.description || 'No content available'}
`;
    }).join('\n\n');

    // Prompt for OpenAI
    const prompt = `I have the following 5 recent news articles about artificial intelligence. 
Please summarize each article in 2-3 concise sentences that capture the key points.
After summarizing each article individually, please provide a brief overview of the current AI landscape based on these articles.
Format your response in HTML that can be directly included in an email newsletter.
Use a clean, professional design with proper headings and spacing.

Here are the articles:

${articlesText}`;

    console.log("Calling OpenAI API to summarize news articles...");
    
    // Call OpenAI API using GPT-4o model
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert AI news analyst helping to create a professional newsletter. Provide concise, insightful summaries of AI news articles. Format your response in clean HTML suitable for an email newsletter."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    console.log("Successfully received response from OpenAI!");
    
    return {
      htmlContent: response.choices[0].message.content,
      articles: articles
    };
  } catch (error) {
    console.error('Error summarizing news with OpenAI:', error);
    throw error;
  }
}

/**
 * Test the news summarization functionality
 */
async function testNewsSummarization() {
  try {
    console.log("Starting news summarization test...");
    
    const summarizedContent = await summarizeNewsWithOpenAI(mockArticles);
    
    console.log("\n--- NEWS SUMMARY HTML ---\n");
    console.log(summarizedContent.htmlContent);
    console.log("\n--- END OF NEWS SUMMARY ---\n");
    
    console.log("News summarization test completed successfully!");
    
    return {
      title: "Latest AI News from TechwithLC",
      date: new Date().toLocaleDateString(),
      content: summarizedContent.htmlContent,
      articles: summarizedContent.articles
    };
  } catch (error) {
    console.error('Error in testNewsSummarization:', error);
  }
}

// Run the test
testNewsSummarization();
