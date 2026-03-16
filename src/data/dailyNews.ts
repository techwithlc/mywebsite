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

export interface FeatureItem {
  name: string;
  nameEn?: string;
  desc: string;
  descEn?: string;
  source: string;
  url: string;
}

export interface Feature {
  title: string;
  titleEn?: string;
  intro: string;
  introEn?: string;
  items: FeatureItem[];
}

export interface DailyDigest {
  date: string; // ISO "2026-03-12"
  items: NewsItem[];
  market?: string;
  marketEn?: string;
  feature?: Feature;
}

// Newest first.
const digests: DailyDigest[] = [
  {
    date: "2026-03-16",
    items: [
      {
        title: "主權晶片浪潮衝擊全球AI供應鏈：中國自主製造突圍，TSMC壟斷格局面臨挑戰",
        titleEn: "Sovereign Silicon Rising: China's Self-Sufficiency Push Fractures AI's Chipmaking Monopoly",
        summary: "全球AI產業對TSMC等少數代工廠的依賴已成致命弱點，中國等國家正加速建設國內晶片製造能力以實現科技自主。這不僅是產能競賽，更是重塑地緣科技政治的關鍵戰場，將直接衝擊現有晶片供應鏈的商業模式。",
        summaryEn: "AI's dependency on a handful of foundries like TSMC has become a critical vulnerability, driving nations—particularly China—to build domestic semiconductor capacity. This isn't merely about supply; it's a geopolitical reconfiguration that will fundamentally reshape chip commercialization and market access.",
        why: "對AI晶片供應商而言，主權晶片興起意味著市場分割和客戶流失風險；對雲端服務商而言，芯片來源多元化將重塑採購談判力量，但短期內可能加劇供應不確定性。",
        whyEn: "Chip suppliers face market fragmentation and customer attrition risks; cloud operators gain negotiating leverage through diversified sourcing but face near-term supply volatility.",
        source: "Daily AI News 4 Everyone",
        url: "https://www.youtube.com/watch?v=gVdWC7VGIpc",
        time: "10:37 TST",
      },
      {
        title: "Agent AI硬體軍備競賽正式開啟：Nvidia、AWS爭相推出專用運算引擎",
        titleEn: "The Agent AI Hardware Arms Race Begins: Nvidia and AWS Deploy Specialized Compute Engines",
        summary: "自主規劃型AI（Agentic AI）正從實驗室走入商業應用，Nvidia開發專用CPU、AWS部署Cerebras晶片組，標誌著AI基礎設施需求從通用加速器向專用運算的關鍵轉變。",
        summaryEn: "Agentic AI's leap from research to enterprise deployment is forcing hardware makers to abandon general-purpose accelerators. Nvidia and AWS's specialized chips signal that the next infra wave demands purpose-built silicon, not scaled-up versions of training hardware.",
        why: "這預示著基礎設施廠商必須分化產品線——訓練晶片與推理晶片的邊界正在模糊，企業採購決策將複雜化，但也代表市場正從「更大」轉向「更特化」，這對邊緣運算和垂直整合策略的投資者而言是重大機遇。",
        whyEn: "Infrastructure players must bifurcate product lines; the training-inference boundary dissolves. Enterprise procurement becomes more intricate, but market differentiation shifts from scale to specialization—a critical advantage for vertical integrators.",
        source: "Daily AI News 4 Everyone",
        url: "https://www.youtube.com/watch?v=gVdWC7VGIpc",
        time: "10:37 TST",
      },
      {
        title: "ChatGPT精準度跌出及格線：Rutgers研究戳破「通用智慧」迷思",
        titleEn: "ChatGPT Flunks Accuracy Test: Rutgers Study Deflates AGI Hype",
        summary: "賓州大學Rutgers商學院研究證實ChatGPT在複雜推理任務上的準確度和一致性嚴重不足，直接挑戰業界對通用人工智慧(AGI)臨近的樂觀預言。研究表明當前生成式AI仍停留在高級文本匹配階段，概念智慧遠未達成。",
        summaryEn: "A Rutgers study published in the Rutgers Business Review documents ChatGPT's reliability collapse on nuanced, multi-step reasoning—vindicating skeptics who argue linguistic fluency masks fundamental conceptual gaps. The takeaway: AGI's timeline extends far beyond current hype cycles.",
        why: "對企業用戶而言，這意味著將AI部署在需要真正理性判斷的關鍵決策中仍存在重大風險；對投資人而言，這挑戰了超大型模型即將成為通用工具的敘事，可能重塑對邊界化、垂直領域AI應用的估值預期。",
        whyEn: "Enterprise deployments in judgment-critical domains remain hazardous; investors should recalibrate timelines for AGI-dependent business models toward domain-specific, vertically-focused AI applications.",
        source: "WSU News & Media Relations",
        url: "https://news.wsu.edu/press-release/2026/03/16/ai-gets-a-d-study-shows-inaccuracies-inconsistency-in-chatgpt-answers/",
        time: "10:37 TST",
      },
      {
        title: "軍事AI失控風險浮現：Pentagon與Anthropic對峙後，OpenAI低眉順眼交出「無限制」模型",
        titleEn: "Pentagon Weaponizes AI Policy: OpenAI Capitulates Where Anthropic Resisted",
        summary: "Anthropic拒絕移除安全防護措施遭美國防部列為供應鏈風險，而OpenAI卻同意無條件向Pentagon提供AI模型並宣稱放棄使用監管權。這不是技術爭議，而是美國國防體系在AI武器化問題上摧毀業界倫理底線的直接證據。",
        summaryEn: "Anthropic's refusal to strip guardrails triggered Pentagon retaliation; OpenAI's capitulation—claiming zero control over military deployment—signals the defense establishment's willingness to dismantle commercial AI ethics to secure unrestricted access. The guardrail is gone.",
        why: "這標誌著民間AI廠商的安全承諾在國家安全壓力下徹底瓦解；對整個AI產業而言，這預示著政府軍事採購將成為迴避倫理審查的新管道，同時強化了AI governance與國防決策的深度耦合，改變了科技企業的政治經濟地位。",
        whyEn: "Commercial AI safety protocols are now subordinate to defense procurement; expect military use cases to become the preferred regulatory arbitrage mechanism, fundamentally reordering the political economy of AI governance.",
        source: "AI on the Horizon: March 16, 2026",
        url: "https://www.signal49.ca/insights/ai-on-the-horizon-march-16-2026/",
        time: "10:37 TST",
      },
    ],
    market: "AI基礎設施從寡頭統治走向多極化，但這不是好消息——供應鏈碎片化將增加成本與複雜度，同時軍事應用的加速會重塑產業政治，而模型精準度的瓶頸則挑戰了「更大即更好」的資本邏輯。",
    marketEn: "Infrastructure fragmentation ends monopoly pricing but increases systemic complexity; military applications reshape governance; accuracy headwinds challenge the 'scale solves everything' thesis. Consolidation pressures and bifurcation risks ahead.",
  },
  {
    date: "2026-03-16",
    items: [
      {
        title: "Meta 擬裁員 20% 強化 AI 基礎設施，年增 60 億美元投資",
        titleEn: "Meta Plans 20% Layoffs to Boost $6B AI Infrastructure Investment",
        summary: "Meta 正考慮大規模裁員與戰略調整，將每年增加 60 億美元 AI 基礎設施預算。此舉可能影響數萬名員工，凸顯科技巨頭在生成式 AI 軍備競賽中的資源重分配趨勢。",
        summaryEn: "Meta is reportedly planning a 20% workforce reduction to redirect resources toward AI infrastructure, increasing annual investment by $6B — highlighting tech giants' prioritization of generative AI despite workforce implications.",
        why: "揭示 Meta 對生成式 AI 的戰略投入力度，反映科技產業在 AI 浪潮中的組織調整模式。",
        whyEn: "Reveals Meta's aggressive bet on generative AI infrastructure and reflects industry-wide workforce recalibration as AI capex crowds out headcount.",
        source: "Reuters",
        url: "https://www.financialexpress.com/business/news/ais-rapid-rise-to-powerthe-next-infrastructure-wave-vs-hariharan-group-ceo-redington/4173832/",
        time: "12:34 TST",
      },
      {
        title: "中國網信辦禁用 OpenClaw AI 代理，揭露提示注入漏洞",
        titleEn: "China Bans OpenClaw AI Agents Over Prompt Injection Vulnerabilities",
        summary: "中國 CNCERT 警告 OpenClaw 開源 AI 代理存在預設漏洞，可被利用進行提示注入攻擊及資料外洩，已禁止政府系統使用。",
        summaryEn: "China's CNCERT warns of critical vulnerabilities in OpenClaw AI agents that allow prompt injection and data exfiltration, prohibiting government system use.",
        why: "首個國家級機構正視開源 AI 代理安全風險，反映自主 AI 系統的安全治理挑戰。",
        whyEn: "Marks the first national-level ban on an open-source AI agent framework — a signal that autonomous AI security governance is moving from advisory to enforcement.",
        source: "The Hacker News",
        url: "https://thehackernews.com/2026/03/openclaw-ai-agent-flaws-could-enable.html",
        time: "12:17 TST",
      },
      {
        title: "Ledger 硬體錢包整合 MoonPay AI 代理，加密交易安全升級",
        titleEn: "Ledger Hardware Wallet Integrates with MoonPay AI Agents for Secure Crypto Transactions",
        summary: "MoonPay 推出 Ledger 硬體錢包簽名功能，讓 AI 代理交易需經離線設備驗證，私鑰不離開硬體裝置。",
        summaryEn: "MoonPay introduces Ledger hardware wallet integration for AI-driven crypto transactions, requiring offline device verification while keeping private keys securely in hardware.",
        why: "建立新一代加密代理的安全標準，解決 AI 自動交易與私鑰保管的矛盾。",
        whyEn: "Sets a new security benchmark for crypto agents — resolving the tension between AI automation and private key custody that has blocked enterprise adoption.",
        source: "CoinDesk",
        url: "https://www.coindesk.com/tech/2026/03/13/moonpay-introduces-ledger-secured-ai-crypto-agents-to-address-wallet-key-risks",
        time: "11:40 TST",
      },
    ],
    market: "加密貨幣市場因 AI 代理安全方案推出上漲 2.3%",
    marketEn: "Crypto market rises 2.3% on AI agent security innovations.",
  },
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
    feature: {
      title: "🔬 專題：OpenClaw 玩最狠的那群人",
      titleEn: "🔬 Feature: The People Pushing OpenClaw Hardest",
      intro: "OpenClaw 不只是一個工具——它正在被一群人玩出完全不同的方向。以下是目前最值得關注的四個方向。",
      introEn: "OpenClaw isn't just a tool — a handful of builders are taking it somewhere completely different. Here are four directions worth watching.",
      items: [
        {
          name: "MattPRD — Moltbook：AI Agent 社群平台",
          nameEn: "MattPRD — Moltbook: AI Agent Social Platform",
          desc: "打造了 Moltbook，一個純 AI Agent 驅動的社群平台（類 Reddit）。Andrej Karpathy、Simon Willison 都稱它是「網路上目前最有趣的地方」。",
          descEn: "Built Moltbook, a social platform (think Reddit) run entirely by AI Agents. Andrej Karpathy and Simon Willison both called it 'the most interesting place on the internet right now.'",
          source: "TechFlow",
          url: "https://techflow.com",
        },
        {
          name: "騰訊工程師 — 深圳「OpenClaw 安裝派對」",
          nameEn: "Tencent Engineers — Shenzhen OpenClaw Install Party",
          desc: "深圳總部舉辦安裝派對，近千人排隊。騰訊、阿里、MiniMax 等已相繼推出自家 OpenClaw 版本，中國大廠正式入場。",
          descEn: "An install party at Tencent HQ drew nearly a thousand people queuing up. Tencent, Alibaba, and MiniMax have all shipped their own OpenClaw forks — Chinese tech giants are officially in the game.",
          source: "Fortune",
          url: "https://fortune.com",
        },
        {
          name: "硬體社群 — 語音控制開源機器人 Reachy Mini",
          nameEn: "Hardware Hackers — Voice-Controlled Reachy Mini",
          desc: "有人把 OpenClaw 接上開源機器人 Reachy Mini，透過 Telegram 語音指令控制機器人做複雜動作，完全不需要會寫程式。",
          descEn: "Someone connected OpenClaw to the open-source Reachy Mini robot — controlling it with Telegram voice messages to perform complex actions, zero coding required.",
          source: "36Kr",
          url: "https://36kr.com",
        },
        {
          name: "守界科技 — ROCm 最佳化，本地跑 Qwen 速度 +400%",
          nameEn: "Shoujie Technology — ROCm Optimization, Local Qwen at +400% Speed",
          desc: "基於 ROCm 最佳化推理引擎，讓 Qwen 在本地的速度最高提升 400%，目標是讓 OpenClaw 完全離線、零 Token 費用運行。",
          descEn: "ROCm-optimized inference engine boosts local Qwen performance by up to 400%. Goal: fully offline OpenClaw with zero token costs.",
          source: "36Kr",
          url: "https://36kr.com",
        },
      ],
    },
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
