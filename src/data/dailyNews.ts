export interface NewsItem {
  title: string;
  summary: string;
  why: string;
  source: string;
  url: string;
  time: string;
}

export interface DailyDigest {
  date: string; // ISO "2026-03-12"
  items: NewsItem[];
  market?: string;
}

// Newest first. Only the latest N days are shown in the UI.
const digests: DailyDigest[] = [
  {
    date: "2026-03-12",
    items: [
      {
        title: "美聯邦 AI 監管截止日到期：商務部＋FTC 報告出爐",
        summary: "川普 AI 行政命令設定的 3/11 截止日正式到期，商務部須點名「干擾聯邦框架」的州法，FTC 須發布政策聲明定義何種州法可被聯邦優先推翻。",
        why: "實質上是用聯邦框架清洗過度限制模型輸出的州法，對 OpenAI、Anthropic、Google 等全美服務商影響深遠。",
        source: "Baker Botts / White House",
        url: "https://ourtake.bakerbotts.com/post/102mirs/march-2026-federal-deadlines-that-will-reshape-the-ai-regulatory-landscape",
        time: "18:00 TST",
      },
      {
        title: "中國限制政府與國企使用第三方 Agent AI",
        summary: "中國政府下令國企與政府機關不得在辦公設備上跑第三方代理 AI 應用，要求改用「國產、安全可控」大模型，理由為資安與數據外流風險。",
        why: "Agent 型 AI 在中國政企市場將受明顯限制，阿里、百度、華為系本土雲端廠相對受惠，外資與開源代理框架受擠壓。",
        source: "Taipei Times",
        url: "https://www.taipeitimes.com",
        time: "20:00 TST",
      },
      {
        title: "NVIDIA 宣布投資 Nebius 20 億美元，股價大漲 10%",
        summary: "NVIDIA 公布對 AI 雲端新創 Nebius Group 投資 20 億美元，用於擴大 AI 基礎設施與 GPU 雲服務，Nebius 股價盤中飆升 10%。",
        why: "強化 NVIDIA 生態版圖，從硬體延伸到雲端服務，利好其軟硬整合策略，並帶動 AI 雲端供應鏈熱錢。",
        source: "CNBC",
        url: "https://www.cnbc.com/2026/03/11/nebius-nvidia-ai-cloud.html",
        time: "04:00 TST",
      },
      {
        title: "五角大廈正式棄用 Anthropic，OpenAI 緊急接盤",
        summary: "五角大廈以「國家安全供應鏈風險」為由切斷與 Anthropic 合作，並當天簽 OpenAI 合約，Sam Altman 強調維持安全紅線。",
        why: "首次用供應鏈標籤打擊本土 AI 公司，預示軍事 AI 應用將加速集中於「配合度高」的供應商。",
        source: "Malwarebytes",
        url: "https://www.malwarebytes.com/blog/news/2026/03/pentagon-ditches-anthropic-ai-over-security-risk-and-openai-takes-over",
        time: "02:00 TST",
      },
      {
        title: "亞馬遜：AI 代碼變更須經資深工程師審核",
        summary: "亞馬遜因近期服務中斷事件，要求所有生成式 AI 輔助代碼變更必須經資深工程師審核，強調 AI 並非當機根源但需加強治理。",
        why: "大型雲端商開始制度化 AI 代碼審核，反映企業在生產環境導入 AI 工具時的安全與可靠性挑戰。",
        source: "TechNews",
        url: "https://technews.tw/2026/03/11/amazon-insists-ai-coding-is-not-source-of-outages/",
        time: "10:00 TST",
      },
    ],
    market: "NVDA 受投資消息帶動小漲，AI 雲端概念股活躍；整體科技股穩盤。",
  },
];

export function getDigests(): DailyDigest[] {
  return digests;
}
