export interface NewsItem {
  title: string;
  summary: string;
  why: string;
  source: string;
  url: string;
  time: string;
  titleEn?: string;
  summaryEn?: string;
  whyEn?: string;
}

export interface DailyDigest {
  date: string; // ISO "2026-03-12"
  items: NewsItem[];
  market?: string;
  marketEn?: string;
}

// Newest first.
const digests: DailyDigest[] = [
  {
    date: "2026-03-14",
    items: [
      {
        title: "美國各州 AI 法案全面開火：chatbot 標示、深偽防制、AI 人格禁止令",
        titleEn: "US State AI Bills Surge: Chatbot Disclosure, Deepfake Bans, AI Non-Personhood Laws",
        summary: "Transparency Coalition 彙整顯示，3 月初已有十多個州法案推進委員會，涵蓋 Florida「AI Bill of Rights」（禁止未成年無家長同意使用）、多州「Professional AI Oversight Act」（AI 參與內容生成須揭露）、以及明文禁止 AI 擁有法律人格的「AI Non-Sentience and Responsibility Act」。",
        summaryEn: "The Transparency Coalition reports over a dozen state bills advancing in committees in early March — covering Florida's 'AI Bill of Rights' (blocking minors without parental consent), multi-state 'Professional AI Oversight Acts' requiring disclosure when AI generates content, and 'AI Non-Sentience and Responsibility Acts' explicitly denying AI legal personhood.",
        why: "聯邦框架管大方向，州法才是 SaaS/Agent/chatbot 實際要遵守的細節。美國市場的 disclosure、未成年保護、醫療保險場景規範，將直接影響產品設計與合規成本。",
        whyEn: "Federal policy sets the direction, but state laws are what SaaS/Agent/chatbot products actually have to comply with. Disclosure requirements, minor protections, and healthcare/insurance AI rules will directly shape product design and compliance costs in the US market.",
        source: "Transparency Coalition",
        url: "https://www.transparencycoalition.ai/news/ai-legislative-update-march13-2026",
        time: "10:00 TST",
      },
      {
        title: "GPT-5.4「原生電腦控制」被評為 3 月最大技術事件",
        titleEn: "GPT-5.4 'Native Computer Use' Named March's Biggest Technical Event",
        summary: "GPT-5.4 推出原生 computer use 能力，可直接操作 OS、瀏覽器與應用程式完成多步驟任務，分標準版、Thinking 版、Pro 版。在 OSWorld-Verified、WebArena Verified 基準創新高，較 GPT-5.2 錯誤率降 18%、幻覺降 33%。",
        summaryEn: "GPT-5.4 ships native computer use — directly operating OS, browsers, and apps for multi-step tasks. Available in Standard, Thinking, and Pro tiers. Sets new highs on OSWorld-Verified and WebArena Verified benchmarks: 18% fewer errors and 33% fewer hallucinations vs GPT-5.2.",
        why: "把 Auto-GPT / Browser-use 類 Agent 正式 productize，RPA 市場面臨直接衝擊。原生電腦控制讓安全邊界從 prompt 層移到 OS/identity/audit 層，推升 Agent 安全與權限分級 infra 需求。",
        whyEn: "Auto-GPT / Browser-use style agents are now a first-party product, putting traditional RPA vendors at risk. Native computer control shifts the security boundary from the prompt layer to OS/identity/audit, driving demand for agent security and permission-scoping infra.",
        source: "Humai / OpenAI",
        url: "https://www.humai.blog/ai-news-trends-march-2026-complete-monthly-digest/",
        time: "14:00 TST",
      },
    ],
    market: "AI 監管概念股與合規 SaaS 受關注；GPT-5.4 發布帶動 OpenAI 生態廠商小漲。",
    marketEn: "AI compliance/governance stocks in focus; GPT-5.4 launch lifts OpenAI-ecosystem names.",
  },
  {
    date: "2026-03-13",
    items: [
      {
        title: "Anthropic 宣布都柏林擴編 200 職，強攻歐洲企業 AI 市場",
        titleEn: "Anthropic Announces 200 Dublin Hires, Targeting European Enterprise AI",
        summary: "Anthropic 宣布將在 2027 年前於愛爾蘭都柏林新增 200 個高薪職缺（工程、銷售、財務、法務、營運），並將辦公空間擴大至約 21,000 平方英尺，因應歐洲企業對 Claude 服務的快速成長。",
        summaryEn: "Anthropic will add 200 high-paying roles in Dublin by 2027 — spanning engineering, sales, finance, legal, and operations — and expand its office to ~21,000 sq ft to meet surging European enterprise demand for Claude.",
        why: "在美國遭五角大廈與財政部施壓的背景下，Anthropic 明顯將重心轉向歐洲，以「安全、可信賴」為品牌核心。歐洲將成為前沿模型廠的關鍵增長市場，也讓企業在選擇 OpenAI vs Anthropic vs Google Gemini 時多出「法規治理形象」這個砝碼。",
        whyEn: "Under pressure from the Pentagon and Treasury in the US, Anthropic is visibly pivoting to Europe with 'safe and trustworthy' as its brand anchor. Europe is becoming a critical growth market for frontier model providers, adding a 'regulatory governance' dimension to enterprise vendor selection.",
        source: "Anthropic",
        url: "https://www.anthropic.com/news/dublin",
        time: "09:00 TST",
      },
      {
        title: "五角大廈禁 Anthropic 令開「6 個月豁免後門」",
        titleEn: "Pentagon's Anthropic Ban Gets a 6-Month Exemption Loophole",
        summary: "最新內部備忘錄顯示，五角大廈對 Anthropic 的禁用令為真正無替代品的國安任務保留 6 個月淘汰緩衝期，但整體切換方向不變。",
        summaryEn: "An internal memo reveals the Pentagon's Anthropic ban includes a 6-month phase-out buffer for national security missions with no viable alternatives — though the overall direction of switching to OpenAI remains unchanged.",
        why: "顯示政府 AI 採購的實際轉換成本比外界預期高，短期內 Anthropic 在國防邊緣任務仍有喘息空間，也透露 OpenAI 接盤後的整合壓力。",
        whyEn: "The real cost of switching government AI vendors is higher than expected. Anthropic gets short-term breathing room on fringe defense tasks, while OpenAI faces integration pressure to fill the gap fast.",
        source: "Axios",
        url: "https://www.axios.com/2026/03/11/openai-anthropic-pentagon-google",
        time: "22:00 TST",
      },
    ],
    market: "歐洲科技股小漲，AI 合規概念受關注。☘️ St. Patrick's Day 倒數 4 天！",
    marketEn: "European tech up slightly; AI compliance plays in focus. ☘️ St. Patrick's Day in 4 days!",
  },
  {
    date: "2026-03-12",
    items: [
      {
        title: "美聯邦 AI 監管截止日到期：商務部＋FTC 報告出爐",
        titleEn: "Federal AI Regulation Deadlines Hit: Commerce Dept + FTC Reports Due",
        summary: "川普 AI 行政命令設定的 3/11 截止日正式到期，商務部須點名「干擾聯邦框架」的州法，FTC 須發布政策聲明定義何種州法可被聯邦優先推翻。",
        summaryEn: "Trump's AI executive order deadlines expired March 11: the Commerce Dept must name state laws that interfere with the federal AI framework, and the FTC must publish a policy statement defining when state AI laws can be federally preempted.",
        why: "實質上是在用聯邦框架清洗過度限制模型輸出的州法，對 OpenAI、Anthropic、Google 等全美服務商影響深遠。",
        whyEn: "This is effectively a federal mechanism to override state laws that overly restrict model outputs — with major implications for OpenAI, Anthropic, Google, and every national AI service provider.",
        source: "Baker Botts / White House",
        url: "https://ourtake.bakerbotts.com/post/102mirs/march-2026-federal-deadlines-that-will-reshape-the-ai-regulatory-landscape",
        time: "18:00 TST",
      },
      {
        title: "中國限制政府與國企使用第三方 Agent AI",
        titleEn: "China Bans Government and SOEs from Third-Party Agent AI Apps",
        summary: "中國政府下令國企與政府機關不得在辦公設備上跑第三方代理 AI 應用，要求改用「國產、安全可控」大模型，理由為資安與數據外流風險。",
        summaryEn: "Beijing has ordered state enterprises and government bodies to stop running third-party AI agent apps on work devices, mandating a switch to 'domestically produced, secure, and controllable' models, citing cybersecurity and data leakage risks.",
        why: "Agent 型 AI 在中國政企市場將受明顯限制，阿里、百度、華為系本土雲端廠相對受惠，外資與開源代理框架受擠壓。",
        whyEn: "Agent-type AI faces significant restrictions in China's government/SOE market. Alibaba, Baidu, and Huawei-ecosystem cloud providers benefit; foreign and open-source agent frameworks get squeezed out.",
        source: "Taipei Times",
        url: "https://www.taipeitimes.com",
        time: "20:00 TST",
      },
      {
        title: "NVIDIA 宣布投資 Nebius 20 億美元，股價大漲 10%",
        titleEn: "NVIDIA Invests $2B in Nebius, Stock Surges 10%",
        summary: "NVIDIA 公布對 AI 雲端新創 Nebius Group 投資 20 億美元，用於擴大 AI 基礎設施與 GPU 雲服務，Nebius 股價盤中飆升 10%。",
        summaryEn: "NVIDIA announced a $2B investment in AI cloud startup Nebius Group to expand AI infrastructure and GPU cloud services. Nebius shares jumped 10% intraday.",
        why: "強化 NVIDIA 生態版圖，從硬體延伸到雲端服務，利好其軟硬整合策略，並帶動 AI 雲端供應鏈熱錢。",
        whyEn: "NVIDIA is extending its moat from hardware into cloud services. The deal reinforces its hardware-software integration strategy and signals hot money flowing into the AI cloud supply chain.",
        source: "CNBC",
        url: "https://www.cnbc.com/2026/03/11/nebius-nvidia-ai-cloud.html",
        time: "04:00 TST",
      },
      {
        title: "五角大廈正式棄用 Anthropic，OpenAI 緊急接盤",
        titleEn: "Pentagon Drops Anthropic, OpenAI Steps In",
        summary: "五角大廈以「國家安全供應鏈風險」為由切斷與 Anthropic 合作，並當天簽 OpenAI 合約，Sam Altman 強調維持安全紅線。",
        summaryEn: "The Pentagon severed ties with Anthropic citing 'national security supply chain risk' and signed an OpenAI contract the same day. Sam Altman emphasized maintaining safety guardrails.",
        why: "首次用供應鏈標籤打擊本土 AI 公司，預示軍事 AI 應用將加速集中於「配合度高」的供應商。",
        whyEn: "The first use of a supply chain label to sideline a domestic AI company — signaling military AI procurement will consolidate around 'cooperative' vendors.",
        source: "Malwarebytes",
        url: "https://www.malwarebytes.com/blog/news/2026/03/pentagon-ditches-anthropic-ai-over-security-risk-and-openai-takes-over",
        time: "02:00 TST",
      },
      {
        title: "亞馬遜：AI 代碼變更須經資深工程師審核",
        titleEn: "Amazon Mandates Senior Engineer Review for All AI-Generated Code Changes",
        summary: "亞馬遜因近期服務中斷事件，要求所有生成式 AI 輔助代碼變更必須經資深工程師審核，強調 AI 並非當機根源但需加強治理。",
        summaryEn: "Following recent outages, Amazon now requires all AI-assisted code changes to be reviewed by a senior engineer. The company says AI wasn't the root cause of downtime but needs stronger governance.",
        why: "大型雲端商開始制度化 AI 代碼審核，反映企業在生產環境導入 AI 工具時的安全與可靠性挑戰。",
        whyEn: "A major cloud provider formalizing AI code review signals that enterprises are waking up to the reliability and safety challenges of deploying AI coding tools in production.",
        source: "TechNews",
        url: "https://technews.tw/2026/03/11/amazon-insists-ai-coding-is-not-source-of-outages/",
        time: "10:00 TST",
      },
    ],
    market: "NVDA 受投資消息帶動小漲，AI 雲端概念股活躍；整體科技股穩盤。",
    marketEn: "NVDA ticked up on investment news; AI cloud names active. Broader tech steady.",
  },
];

export function getDigests(): DailyDigest[] {
  return digests;
}
