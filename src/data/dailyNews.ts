export interface NewsItem {
  title: string;
  summary: string;
  why: string;
  source: string;
  sourceLabel: string;
  url: string;
  time: string; // e.g. "04:00 TST"
}

export interface MarketNote {
  text: string;
}

export interface DailyDigest {
  date: string; // ISO format: "2026-03-12"
  items: NewsItem[];
  market?: MarketNote;
}

// Add new days at the top. Latest entry is always shown.
const digests: DailyDigest[] = [
  {
    date: "2026-03-12",
    items: [
      {
        title: "NVIDIA 宣布投資 Nebius 20 億美元，股價大漲 10%",
        summary: "NVIDIA 公布對 AI 雲端新創 Nebius Group 投資 20 億美元，用於擴大 AI 基礎設施與 GPU 雲服務，Nebius 股價盤中飆升 10%。",
        why: "強化 NVIDIA 生態版圖，從硬體延伸到雲端服務，利好其軟硬整合策略，並帶動 AI 雲端供應鏈熱錢。",
        source: "CNBC",
        sourceLabel: "cnbc",
        url: "https://www.cnbc.com/2026/03/11/nebius-nvidia-ai-cloud.html",
        time: "04:00 TST",
      },
      {
        title: "OpenAI 與 Anthropic 軍事爭議升溫，Axios：Google 漁翁得利",
        summary: "Axios 分析，OpenAI 接手五角大廈合約、Anthropic 被標為供應鏈風險的內鬥，讓 Google 安靜進展 Gemini 與雲端 AI，成為最大贏家。",
        why: "顯示地緣與政策風險正重塑 AI 領導格局，Google 的低調策略可能在企業/政府客戶中獲益。",
        source: "Axios",
        sourceLabel: "axios",
        url: "https://www.axios.com/2026/03/11/openai-anthropic-pentagon-google",
        time: "08:00 TST",
      },
      {
        title: "五角大廈正式棄用 Anthropic，OpenAI 緊急接盤",
        summary: "Malwarebytes 報導，五角大廈以「國家安全供應鏈風險」為由切斷與 Anthropic 合作，並當天簽 OpenAI 合約，Sam Altman 強調維持安全紅線。",
        why: "首次用供應鏈標籤打擊本土 AI 公司，預示軍事 AI 應用將加速集中於「配合度高」的供應商。",
        source: "Malwarebytes",
        sourceLabel: "malwarebytes",
        url: "https://www.malwarebytes.com/blog/news/2026/03/pentagon-ditches-anthropic-ai-over-security-risk-and-openai-takes-over",
        time: "02:00 TST",
      },
      {
        title: "亞馬遜內部：AI 代碼變更須經資深工程師審核",
        summary: "亞馬遜因近期服務中斷事件，要求所有生成式 AI 輔助代碼變更必須經資深工程師審核，強調 AI 並非當機根源但需加強治理。",
        why: "大型雲端商開始制度化 AI 代碼審核，反映企業在生產環境導入 AI 工具時的安全與可靠性挑戰。",
        source: "TechNews",
        sourceLabel: "technews",
        url: "https://technews.tw/2026/03/11/amazon-insists-ai-coding-is-not-source-of-outages/",
        time: "10:00 TST",
      },
    ],
    market: {
      text: "NVDA 受投資消息帶動小漲，AI 雲端概念股活躍；整體科技股穩盤。",
    },
  },
];

export function getLatestDigest(): DailyDigest {
  return digests[0];
}
