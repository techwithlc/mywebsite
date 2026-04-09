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
    date: "2026-04-09",
    items: [
      {
        title: "NVIDIA vs 華為：AI 晶片全球霸權的正面對決",
        titleEn: "NVIDIA vs. Huawei: The Frontal Battle for Global AI Chip Hegemony",
        summary: "分析指出 NVIDIA 與華為在 AI 晶片領域的競爭已進入白熱化階段，雙方代表著美中科技競爭的最前線。這不是單純的企業競爭，這是兩個技術路線、兩套供應鏈、兩個地緣政治陣營的終極對決——NVIDIA 掌握先進製程與 CUDA 生態，華為靠政策保護與本土市場反擊。",
        summaryEn: "Analysis shows NVIDIA-Huawei competition in AI chips has entered white-hot phase, representing the frontline of U.S.-China tech rivalry. This isn't just corporate competition — it's the ultimate showdown between two tech paths, two supply chains, two geopolitical camps. NVIDIA wields advanced nodes and CUDA ecosystem; Huawei fights back with policy protection and domestic market.",
        why: "這標誌著 AI 晶片競爭從「技術領先」轉向「陣營對抗」。對 NVIDIA 來說，華為是唯一有能力在全棧（設計、製造、生態）挑戰的對手；對華為來說，這是「被迫自主」後的生死戰；對全球 AI 產業來說，這意味著供應鏈將永久分裂成「西方陣營」和「中國陣營」。對投資人來說，這是選邊站的時刻。",
        whyEn: "This signals AI chip competition shifting from 'tech leadership' to 'camp confrontation.' For NVIDIA, Huawei is the only rival capable of full-stack (design, manufacturing, ecosystem) challenge; for Huawei, it's a life-or-death battle post-'forced independence'; for global AI, it means supply chains will permanently split into 'Western camp' and 'China camp.' For investors, it's time to pick sides.",
        source: "Entrepreneur",
        url: "https://www.entrepreneur.com/business-news/what-the-nvidia-huawei-rivalry-means-for-ai/501630",
        time: "00:30 TST",
      },
      {
        title: "台灣封裝依賴：為何美國自製晶片仍需送台灣「最後一哩」",
        titleEn: "Taiwan Packaging Dependency: Why US-Made Chips Still Need Taiwan's 'Last Mile'",
        summary: "報導指出即使美國成功在本土製造 AI 晶片，仍需送往台灣進行最終封裝處理，凸顯台灣在半導體供應鏈的不可替代性。這不是技術瓶頸，這是「產業集群效應」的勝利——當先進封裝技術、設備、人才都集中在台灣，重建整個生態鏈的成本遠超過「繼續依賴台灣」。",
        summaryEn: "Reports show even US-domestically-manufactured AI chips must be sent to Taiwan for final packaging, highlighting Taiwan's irreplaceability in semiconductor supply chains. This isn't a tech bottleneck — it's the triumph of 'industrial cluster effects.' With advanced packaging tech, equipment, and talent concentrated in Taiwan, rebuilding the entire ecosystem costs far more than 'continued Taiwan dependency.'",
        why: "這標誌著「美國半導體自主化」的不完整性。對美國來說，這是「晶片法案」戰略的最大弱點；對台灣來說，這是地緣政治籌碼的核心；對中國來說，這是「台海風險」對全球 AI 供應鏈的致命威脅；對全球 AI 產業來說，這意味著「去台灣依賴」在短期內不可能實現。對投資人來說，這是台積電、日月光等封裝廠的長期護城河。",
        whyEn: "This signals the incompleteness of 'US semiconductor self-sufficiency.' For the US, it's the biggest weakness in the CHIPS Act strategy; for Taiwan, it's the core of geopolitical leverage; for China, it's the lethal threat of 'Taiwan Strait risk' to global AI supply chains; for the AI industry, it means 'de-Taiwan dependency' is impossible near-term. For investors, it's the long-term moat for TSMC, ASE, etc.",
        source: "Firstpost",
        url: "https://www.firstpost.com/tech/ais-next-challenge-why-even-us-made-chips-must-undergo-final-processing-in-taiwan-13998128.html",
        time: "23:01 TST",
      },
    ],
    market: "NVIDIA vs 華為白熱化、台灣封裝依賴無解——兩條線索指向同一個結論：AI 晶片競爭正在從「技術競賽」轉向「地緣博弈」，從「全球化供應鏈」轉向「陣營化供應鏈」。技術領先不再是唯一變數，地緣政治正在重塑整個產業格局。台灣的不可替代性既是籌碼也是風險，美中對抗將 AI 供應鏈推向永久分裂。",
    marketEn: "NVIDIA vs. Huawei heats up, Taiwan packaging dependency unsolvable — two threads point to one conclusion: AI chip competition is shifting from 'tech race' to 'geopolitical game,' from 'globalized supply chain' to 'camp-based supply chain.' Tech leadership is no longer the only variable; geopolitics is reshaping the entire industry. Taiwan's irreplaceability is both leverage and risk; US-China confrontation pushes AI supply chains toward permanent fragmentation.",
  },
  {
    date: "2026-04-08",
    items: [
      {
        title: "Intel 加入 Musk 200 億美元 TeraFab AI 晶片計畫：機器人與資料中心的豪賭",
        titleEn: "Intel Backs Elon Musk's $20B TeraFab Plan for AI Chip Production: Robotics and Data Center Gamble",
        summary: "Intel 宣布加入 Elon Musk 主導的 200 億美元 TeraFab AI 晶片計畫，目標是為人形機器人和資料中心生產專用晶片。這不是單純的資本聯盟，這是 Intel 在「AI 晶片邊緣化」危機中找到的新戰場——當在雲端推理市場打不過 NVIDIA，轉向機器人和太空應用是生存突圍。",
        summaryEn: "Intel announced joining Elon Musk's $20B TeraFab AI chip initiative targeting humanoid robots and data centers. This isn't just a capital alliance — it's Intel finding a new battlefield amid 'AI chip marginalization' crisis. When cloud inference can't beat NVIDIA, pivoting to robotics and space is survival strategy.",
        why: "這標誌著 AI 晶片競爭從「雲端」延伸到「邊緣與機器人」。對 Intel 來說，這是用 Musk 的願景換取翻盤機會；對 NVIDIA 來說，這是潛在競爭對手在新領域的卡位；對 Musk 來說，這是 Tesla Optimus 和 SpaceX 星艦所需晶片的自主化戰略。對整個 AI 產業來說，這是「應用場景分化」推動晶片設計分化的案例。",
        whyEn: "This signals AI chip competition extending from 'cloud' to 'edge and robotics.' For Intel, it's trading Musk's vision for a comeback shot; for NVIDIA, it's a potential rival positioning in new domains; for Musk, it's self-sufficiency strategy for Tesla Optimus and SpaceX Starship chip needs. For the AI industry, it's a case of 'application scenario differentiation' driving chip design divergence.",
        source: "Interesting Engineering",
        url: "https://interestingengineering.com/ai-robotics/intel-joins-musk-terafab-ai-chip-project",
        time: "04:06 TST",
      },
      {
        title: "Broadcom 股價飆漲 5% 創三週新高：Google、Anthropic 長期晶片合約的市場驗證",
        titleEn: "Broadcom Shares Pop 5% to 3-Week High on Long-Term Google, Anthropic Chip Deals",
        summary: "Broadcom 股價單日暴漲 5%，創三週新高，受 Google 和 Anthropic 長期客製晶片合約利好消息推動。這不是單純的股價波動，這是資本市場對「客製晶片趨勢」的信心投票——當兩大 AI 巨頭都選擇 Broadcom 而非 NVIDIA，市場用真金白銀驗證了這條路線。",
        summaryEn: "Broadcom shares surged 5% to a 3-week high, driven by long-term custom chip deals with Google and Anthropic. This isn't just stock volatility — it's the capital market's confidence vote in the 'custom chip trend.' When two AI giants choose Broadcom over NVIDIA, the market validates this path with real money.",
        why: "這標誌著「客製晶片 vs NVIDIA 標準晶片」競爭進入資本驗證階段。對 Broadcom 來說，這是客製晶片代工業務獲得市場認可；對 NVIDIA 來說，這是標準晶片業務被蠶食的財務證據；對投資人來說，5% 的單日漲幅證明「反 NVIDIA 壟斷」敘事有利可圖。對整個 AI 供應鏈來說，這是「定製化」趨勢的資本加速器。",
        whyEn: "This signals the 'custom chips vs. NVIDIA standard chips' competition entering capital validation phase. For Broadcom, it's market recognition of custom chip foundry business; for NVIDIA, it's financial evidence of standard chip erosion; for investors, the 5% single-day gain proves the 'anti-NVIDIA monopoly' narrative is profitable. For the AI supply chain, it's capital acceleration of the 'customization' trend.",
        source: "Livemint",
        url: "https://www.livemint.com/market/stock-market-news/broadcom-shares-pop-5-to-3-week-high-on-long-term-google-anthropic-chip-deals-11775577132125.html",
        time: "01:00 TST",
      },
    ],
    market: "Intel 加入 Musk 200 億晶片計畫、Broadcom 股價飆漲驗證客製晶片趨勢——兩條線索指向同一個結論：AI 晶片競爭正在從「雲端霸權」轉向「應用分化」，從「NVIDIA 壟斷」轉向「客製聯盟」。Intel 在邊緣與機器人找新戰場，Broadcom 用股價證明客製路線有利可圖。下一階段的競爭，是「誰能在細分市場站穩」和「誰能建立客製生態」。",
    marketEn: "Intel joins Musk's $20B chip plan, Broadcom's stock surge validates custom chip trend — two threads point to one conclusion: AI chip competition is shifting from 'cloud hegemony' to 'application differentiation,' from 'NVIDIA monopoly' to 'custom alliances.' Intel finds new battlegrounds in edge and robotics; Broadcom's stock proves custom path profitability. Next phase: 'Who secures niche markets' and 'Who builds custom ecosystems.'",
  },
  {
    date: "2026-04-07",
    items: [
      {
        title: "Broadcom 擴大與 Google、Anthropic 晶片合約：客製晶片生態戰升級",
        titleEn: "Broadcom Expands Chip Deals with Google, Anthropic: Custom Chip Ecosystem War Escalates",
        summary: "Broadcom 宣布與 Google 和 Anthropic 擴大客製 AI 晶片合作協議。這不是單純的供應鏈新聞，這是「客製晶片 vs NVIDIA 標準晶片」戰爭的新篇章——當 Google 用 TPU、Anthropic 也開始定製晶片，NVIDIA 的「一款晶片打天下」模式正在被顛覆。",
        summaryEn: "Broadcom announced expanded custom AI chip deals with Google and Anthropic. This isn't just supply chain news — it's a new chapter in the 'custom chips vs. NVIDIA standard chips' war. With Google using TPUs and Anthropic now customizing chips, NVIDIA's 'one-chip-fits-all' model is being disrupted.",
        why: "這標誌著 AI 晶片市場從「買 NVIDIA」轉向「自己設計」的臨界點。對 NVIDIA 來說，這是高毛利標準晶片業務被蠶食的警訊；對 Broadcom 來說，這是客製晶片代工業務的黃金機會；對 Google 和 Anthropic 來說，這是擺脫 NVIDIA 依賴、降低成本的戰略突破。對整個 AI 產業來說，這是「晶片定製化」趨勢的加速驗證。",
        whyEn: "This signals the AI chip market hitting a tipping point from 'buy NVIDIA' to 'design your own.' For NVIDIA, it's a warning of high-margin standard chip erosion; for Broadcom, it's a golden opportunity in custom chip foundry; for Google and Anthropic, it's strategic breakthrough in shedding NVIDIA dependency and cutting costs. For the AI industry, it's accelerated validation of the 'chip customization' trend.",
        source: "CNBC",
        url: "https://www.cnbc.com/2026/04/06/broadcom-agrees-to-expanded-chip-deals-with-google-anthropic.html",
        time: "05:41 TST",
      },
      {
        title: "NVIDIA 收購 SchedMD 引發 AI 軟體訪問擔憂：生態控制的邊界在哪？",
        titleEn: "NVIDIA's SchedMD Acquisition Sparks AI Software Access Concerns: Where's the Ecosystem Control Line?",
        summary: "NVIDIA 收購高效能運算排程軟體公司 SchedMD，引發 AI 專家對軟體訪問權的擔憂。這不是單純的軟體收購，這是 NVIDIA 從「賣硬體」轉向「控制軟體生態」的戰略延伸——當 CUDA 已經鎖定開發者，收購排程軟體意味著從「晶片層」擴展到「工作負載調度層」的全棧控制。",
        summaryEn: "NVIDIA's acquisition of high-performance computing scheduler SchedMD sparked AI specialists' concerns over software access. This isn't just a software buyout — it's NVIDIA's strategic extension from 'selling hardware' to 'controlling software ecosystems.' With CUDA already locking in developers, acquiring scheduler software means expanding from 'chip layer' to 'workload orchestration layer' full-stack control.",
        why: "這標誌著 NVIDIA 戰略從「晶片壟斷」轉向「生態壟斷」。對競爭對手（AMD、Intel）來說，這是 NVIDIA 在軟體層築起新護城河的威脅；對雲端服務商來說，這是「供應商鎖定」風險加劇的警訊；對開源社群來說，這是「關鍵基礎設施被私有化」的擔憂。對監管機構來說，這是「科技巨頭垂直整合」是否過度的新案例。",
        whyEn: "This signals NVIDIA's strategy shifting from 'chip monopoly' to 'ecosystem monopoly.' For competitors (AMD, Intel), it's a threat of NVIDIA building new software moats; for cloud providers, it's heightened 'vendor lock-in' risk; for open-source communities, it's concern over 'critical infrastructure privatization.' For regulators, it's a new case of 'excessive tech giant vertical integration.'",
        source: "Reuters",
        url: "https://www.reuters.com/technology/nvidia-acquisition-schedmd-sparks-worry-among-ai-specialists-about-software-2026-04-06/",
        time: "03:33 TST",
      },
      {
        title: "美國出口管制反助中國晶片繁榮：圍堵政策的意外後果",
        titleEn: "US Export Curbs Fuel China's Chip Boom: Unintended Consequences of Containment Policy",
        summary: "報導指出美國對華晶片出口管制反而刺激中國本土晶片產業快速發展。這不是政策失敗的八卦，這是地緣科技戰的「反作用力定律」——當切斷供應鏈成為武器，被切斷的一方會被迫建立自己的供應鏈，最終結果是「技術脫鉤」而非「技術壓制」。",
        summaryEn: "Reports indicate US chip export controls to China are paradoxically fueling domestic Chinese chip industry growth. This isn't policy-failure gossip — it's the 'Newton's third law' of geotech warfare. When supply-chain severing becomes a weapon, the severed side is forced to build its own, resulting in 'tech decoupling' rather than 'tech suppression.'",
        why: "這驗證了「出口管制加速技術自主」的預言。對美國來說，這是圍堵政策「短期有效、長期反噬」的代價；對中國來說，這是「被迫獨立」後的技術突破；對全球供應鏈來說，這是「效率讓位給政治」後的碎片化加速。對 NVIDIA、AMD 來說，這是永久失去中國市場的現實；對華為、中芯國際來說，這是市場保護下的成長機會。",
        whyEn: "This validates the 'export controls accelerate tech self-sufficiency' prophecy. For the US, it's the cost of containment being 'short-term effective, long-term backfiring'; for China, it's tech breakthrough post-'forced independence'; for global supply chains, it's accelerated fragmentation after 'efficiency yielded to politics.' For NVIDIA and AMD, it's permanent Chinese market loss; for Huawei and SMIC, it's growth opportunity under market protection.",
        source: "Benzinga",
        url: "https://www.benzinga.com/markets/tech/26/04/51664580/how-us-export-curbs-are-fueling-chinas-chip-boom",
        time: "01:18 TST",
      },
    ],
    market: "Broadcom 擴大客製晶片合約、NVIDIA 收購排程軟體引發擔憂、美國出口管制反助中國晶片繁榮——三條線索指向同一個結論：AI 晶片競爭正在從「產品競爭」轉向「生態控制」，從「技術領先」轉向「供應鏈分裂」。客製化在挑戰標準化，軟體壟斷在引發反彈，出口管制在加速脫鉤。下一階段的競爭，是「誰控制生態」和「誰能自給自足」。",
    marketEn: "Broadcom expands custom chip deals, NVIDIA's scheduler acquisition sparks concerns, US export curbs fuel China's chip boom — three threads point to one conclusion: AI chip competition is shifting from 'product rivalry' to 'ecosystem control,' from 'tech leadership' to 'supply chain fragmentation.' Customization challenges standardization, software monopoly triggers backlash, export controls accelerate decoupling. Next phase: 'Who controls ecosystems' and 'Who achieves self-sufficiency.'",
  },
  {
    date: "2026-04-02",
    items: [
      {
        title: "Intel 砸 140 億美元收回愛爾蘭 AI 晶片廠全部控制權，股價飆漲 8%",
        titleEn: "Intel Spends $14B to Reclaim Full Control of Ireland AI Chip Factory, Stock Soars 8%",
        summary: "Intel 宣布斥資 140 億美元買回愛爾蘭 AI 晶片廠的完整控制權，股價單日暴漲 8%。這不是單純的資產重組，這是 Intel 在「AI 晶片競賽」中的生死反擊——當 NVIDIA、AMD 都在賺 AI 的錢，Intel 選擇「砸錢收回產能控制」來證明自己還有翻盤機會。",
        summaryEn: "Intel announced a $14B deal to reclaim full control of its Ireland AI chip factory, sending its stock soaring 8% in a single day. This isn't just asset restructuring — it's Intel's do-or-die counterattack in the 'AI chip race.' While NVIDIA and AMD cash in on AI, Intel chose to 'spend big to reclaim capacity control' to prove it still has a comeback shot.",
        why: "這標誌著 Intel 在 AI 晶片市場的「絕地求生」戰略。對 Intel 來說，這是用資本換時間的豪賭；對 NVIDIA 和 AMD 來說，這是競爭對手「還沒死」的警訊；對投資人來說，8% 的股價暴漲證明市場願意給 Intel 第二次機會。對全球 AI 供應鏈來說，這意味著「產能控制權」正在成為競爭焦點。",
        whyEn: "This signals Intel's 'survival mode' strategy in AI chips. For Intel, it's a capital-for-time gamble; for NVIDIA and AMD, it's a warning that the competitor 'isn't dead yet'; for investors, the 8% surge proves the market will give Intel a second chance. For global AI supply chains, it means 'capacity control' is becoming the competitive focal point.",
        source: "Benzinga",
        url: "https://www.benzinga.com/markets/tech/26/04/51606607/intel-spends-14-billion-to-reclaim-full-control-of-key-ireland-ai-chip-factory",
        time: "00:55 TST",
      },
      {
        title: "Cognichip 獲 6000 萬美元融資：用 AI 設計 AI 晶片的「遞迴革命」",
        titleEn: "Cognichip Raises $60M to Reinvent Chip Design with Physics-Inspired AI Models",
        summary: "Cognichip 完成 6000 萬美元融資，目標是用 AI 模型重新發明晶片設計流程，強調「物理啟發的 AI」方法。這不是另一個 AI 設計工具，這是「用 AI 設計 AI 晶片」的遞迴革命——當晶片設計週期從 3 年壓縮到幾個月，誰掌握 AI 設計工具，誰就掌握下一代晶片的迭代速度。",
        summaryEn: "Cognichip secured $60M to reinvent chip design using 'physics-inspired AI models.' This isn't another AI design tool — it's the 'recursive revolution' of using AI to design AI chips. When chip design cycles compress from 3 years to months, whoever controls AI design tools controls next-gen chip iteration speed.",
        why: "這標誌著晶片設計從「人力密集」轉向「AI 自動化」的臨界點。對 NVIDIA、Intel、AMD 來說，這是設計週期被顛覆的威脅；對新創晶片公司來說，這是「用更少人力挑戰巨頭」的機會；對整個 AI 產業來說，這是「AI 加速 AI」的自我強化迴圈。對投資人來說，6000 萬美元證明「AI 設計晶片」已經從概念驗證進入商業化階段。",
        whyEn: "This signals chip design reaching the tipping point from 'labor-intensive' to 'AI-automated.' For NVIDIA, Intel, AMD, it's a design-cycle disruption threat; for chip startups, it's a chance to 'challenge giants with fewer people'; for the AI industry, it's the 'AI accelerates AI' self-reinforcing loop. For investors, the $60M proves 'AI-designed chips' has moved from proof-of-concept to commercialization.",
        source: "TechCrunch",
        url: "https://techcrunch.com/2026/04/01/cognichip-wants-ai-to-design-the-chips-that-power-ai-and-just-raised-60m-to-try/",
        time: "00:00 TST",
      },
    ],
    market: "Intel 砸 140 億奪回產能控制、Cognichip 用 AI 設計 AI 晶片——兩條線索指向同一個結論：AI 晶片競爭正在從「誰的產品快」轉向「誰控制產能」和「誰控制設計工具」。Intel 在用資本換時間，Cognichip 在用 AI 壓縮設計週期。下一階段的競爭，是「誰的迭代速度更快」。",
    marketEn: "Intel's $14B capacity reclaim, Cognichip's AI-for-chip-design — two threads point to one conclusion: AI chip competition is shifting from 'whose product is faster' to 'who controls capacity' and 'who controls design tools.' Intel trades capital for time; Cognichip uses AI to compress design cycles. Next phase: 'Whose iteration speed is faster.'",
  },
  {
    date: "2026-04-01",
    items: [
      {
        title: "NVIDIA 砸 20 億美元投資 Marvell：讓客製 AI 晶片「平民化」",
        titleEn: "NVIDIA Invests $2B in Marvell to Democratize Custom AI Chips",
        summary: "NVIDIA 宣布向 Marvell Technology 投資 20 億美元，目標是讓客製 AI 晶片更容易取得。CEO Jensen Huang 聲明這將擴展 NVIDIA 的 AI 基礎設施生態系統。這不是單純的財務投資，這是 NVIDIA 在「客製晶片威脅」面前的防禦性佈局——與其讓客戶自己找晶片設計商，不如把設計商變成自己的盟友。",
        summaryEn: "NVIDIA announced a $2B investment in Marvell Technology to make custom AI chips more accessible. CEO Jensen Huang stated this will expand NVIDIA's AI infrastructure ecosystem. This isn't just a financial investment — it's NVIDIA's defensive move against the 'custom chip threat.' Rather than let customers find chip designers themselves, turn the designers into allies.",
        why: "這標誌著 NVIDIA 戰略從「賣標準晶片」轉向「控制客製晶片生態」。對雲端服務商（AWS、Google、Meta）來說，這是 NVIDIA 在「收編供應鏈」；對 Marvell 來說，這是獲得資金與技術支持的機會；對 AI 晶片市場來說，這是「標準 vs 客製」競爭的新篇章。對投資人來說，20 億美元證明 NVIDIA 對客製晶片趨勢的焦慮。",
        whyEn: "This signals NVIDIA's strategy shift from 'selling standard chips' to 'controlling custom chip ecosystems.' For cloud providers (AWS, Google, Meta), it's NVIDIA 'co-opting the supply chain'; for Marvell, it's funding and tech support; for the AI chip market, it's a new chapter in 'standard vs. custom' competition. For investors, the $2B proves NVIDIA's anxiety over custom chip trends.",
        source: "Times of India",
        url: "https://timesofindia.indiatimes.com/technology/tech-news/nvidia-invests-2-billion-in-marvell-technology-to-make-custom-ai-chips-more-accessible-to-customers-read-ceo-jensen-huangs-statement/articleshow/129930942.cms",
        time: "01:49 TST",
      },
      {
        title: "台積電日本超高效 AI 晶片廠獲批：地緣供應鏈重組加速",
        titleEn: "TSMC Wins Approval for Ultra-Efficient AI Chip Mega-Factory in Japan",
        summary: "台積電獲日本政府批准，將在日本建設「超高效」AI 晶片超級工廠。這不是產能擴張的例行公告，這是地緣政治驅動的供應鏈重組——當美中科技戰加劇、台海風險上升，日本成為「台積電海外製造」的關鍵據點，也是美日同盟在半導體領域的戰略佈局。",
        summaryEn: "TSMC secured Japanese government approval to build an 'ultra-efficient' AI chip mega-factory in Japan. This isn't routine capacity expansion — it's geopolitically-driven supply chain restructuring. As U.S.-China tech wars intensify and Taiwan Strait risks rise, Japan becomes a key hub for 'TSMC overseas manufacturing' and a strategic play in the U.S.-Japan semiconductor alliance.",
        why: "這標誌著 AI 晶片供應鏈從「台灣集中」轉向「區域分散」。對台積電來說，這是風險分散策略；對日本來說，這是重返半導體製造強國的機會；對美國來說，這是降低「台灣依賴」的戰略布局；對中國來說，這是「圍堵」的又一證據。對全球 AI 產業來說，這意味著「產能在哪裡」正在成為地緣政治籌碼。",
        whyEn: "This signals AI chip supply chain shifting from 'Taiwan concentration' to 'regional dispersion.' For TSMC, it's risk diversification; for Japan, it's a chance to reclaim semiconductor powerhouse status; for the U.S., it's strategic 'Taiwan dependency' reduction; for China, it's another piece of 'containment' evidence. For global AI, it means 'where capacity sits' is becoming a geopolitical chip.",
        source: "Benzinga",
        url: "https://www.benzinga.com/markets/tech/26/03/51574086/taiwan-semiconductor-wins-approval-for-ultra-efficient-ai-chip-mega-factory-in-japan",
        time: "23:51 TST",
      },
    ],
    market: "NVIDIA 砸 20 億收編客製晶片生態、台積電日本廠獲批——兩條線索指向同一個結論：AI 晶片競爭正在從「產品競爭」轉向「生態控制」，從「台灣集中」轉向「地緣分散」。NVIDIA 在防禦客製晶片威脅，台積電在分散地緣政治風險。下一階段的競爭，是「誰控制供應鏈」和「誰掌握產能位置」。",
    marketEn: "NVIDIA's $2B to co-opt custom chip ecosystems, TSMC's Japan factory approval — two threads point to one conclusion: AI chip competition is shifting from 'product rivalry' to 'ecosystem control,' from 'Taiwan concentration' to 'geopolitical dispersion.' NVIDIA is defending against custom chip threats; TSMC is diversifying geopolitical risk. Next phase: 'Who controls the supply chain' and 'Who holds capacity location.'",
  },
  {
    date: "2026-03-31",
    items: [
      {
        title: "韓國 AI 晶片新創 Rebellions 獲 4 億美元融資，估值 23.4 億美元挑戰 NVIDIA",
        titleEn: "South Korea's Rebellions Raises $400M at $2.34B Valuation to Challenge NVIDIA in AI Inference",
        summary: "韓國 AI 推理晶片新創 Rebellions 完成 4 億美元融資，估值達 23.4 億美元，瞄準 NVIDIA 在 AI 推理市場的主導地位並計劃進軍美國市場。這不是另一個「NVIDIA 挑戰者」故事，這是韓國在 AI 晶片自主化戰略中的關鍵棋子——當三星、SK 海力士專注記憶體，Rebellions 補上了運算晶片的拼圖。",
        summaryEn: "South Korean AI inference chip startup Rebellions closed a $400M round at $2.34B valuation, targeting NVIDIA's dominance in AI inference and planning U.S. expansion. This isn't another 'NVIDIA challenger' story — it's a key piece in South Korea's AI chip self-sufficiency strategy. While Samsung and SK Hynix focus on memory, Rebellions fills the compute chip gap.",
        why: "這標誌著 AI 晶片競爭從「美中對抗」延伸到「區域自主化」。對 NVIDIA 來說，這是推理市場被蠶食的新威脅；對韓國來說，這是擺脫「只做記憶體」標籤的戰略突破；對全球供應鏈來說，這是「多極化」趨勢的又一驗證。對投資人來說，4 億美元融資證明資本對「NVIDIA 替代品」的需求依然強勁。",
        whyEn: "This signals AI chip competition extending from 'U.S.-China rivalry' to 'regional self-sufficiency.' For NVIDIA, it's a new threat eroding inference share; for South Korea, it's a strategic breakthrough beyond the 'memory-only' label; for global supply chains, it's another validation of 'multipolar' trends. For investors, the $400M raise proves capital demand for 'NVIDIA alternatives' remains robust.",
        source: "Reuters",
        url: "https://www.reuters.com/business/media-telecom/south-koreas-ai-chip-startup-rebellions-raises-400-million-latest-funding-round-2026-03-30/",
        time: "21:04 TST",
      },
      {
        title: "台積電領航 2025 年晶片業 3200 億美元成長潮",
        titleEn: "TSMC Anchors $320 Billion Chip Boom in 2025",
        summary: "台積電在 2025 年引領全球晶片產業創造 3200 億美元營收成長，AI 晶片需求是主要驅動力。這不是單純的業績報告，這是「AI 算力軍備競賽」在財報上的體現——當所有雲端服務商、AI 公司都在搶先進製程產能，台積電的議價權已經到了歷史新高。",
        summaryEn: "TSMC led the global chip industry to $320B revenue growth in 2025, driven primarily by AI chip demand. This isn't just earnings reporting — it's the 'AI compute arms race' manifesting in financial statements. With every cloud provider and AI company scrambling for advanced-node capacity, TSMC's pricing power has reached historic highs.",
        why: "這驗證了「AI 基礎設施擴張」的真實性，也凸顯了台積電在全球 AI 供應鏈的不可替代性。對投資人來說，這是「AI 需求是否過熱」爭論的實證支持；對地緣政治分析師來說，這是台灣戰略地位的又一證明；對競爭對手（Intel、Samsung）來說，這是追趕差距持續擴大的警訊。",
        whyEn: "This validates the reality of 'AI infrastructure expansion' and highlights TSMC's irreplaceability in the global AI supply chain. For investors, it's empirical support in the 'Is AI demand overheated?' debate; for geopolitical analysts, it's another proof of Taiwan's strategic position; for competitors (Intel, Samsung), it's a warning that the gap keeps widening.",
        source: "Benzinga",
        url: "https://www.benzinga.com/markets/tech/26/03/51538010/taiwan-semiconductor-anchors-explosive-320-billion-chip-boom-in-2025",
        time: "21:27 TST",
      },
    ],
    market: "Rebellions 獲 4 億美元融資、台積電引領 3200 億美元晶片成長——兩條線索指向同一個結論：AI 晶片市場正在從「NVIDIA 獨大」轉向「區域多極」，從「需求質疑」轉向「成長驗證」。資本繼續押注 NVIDIA 替代品，台積電用財報證明 AI 需求是真的。下一階段的競爭，是「誰能搶到台積電產能」。",
    marketEn: "Rebellions' $400M raise, TSMC's $320B chip boom — two threads point to one conclusion: the AI chip market is shifting from 'NVIDIA dominance' to 'regional multipolarity,' from 'demand skepticism' to 'growth validation.' Capital keeps betting on NVIDIA alternatives; TSMC's financials prove AI demand is real. Next phase competition: 'Who can secure TSMC capacity.'",
  },
  {
    date: "2026-03-30",
    items: [
      {
        title: "OpenAI 融資困境衝擊記憶體晶片價格：AI 泡沫警訊？",
        titleEn: "OpenAI Funding Fears Hit Memory Chip Prices: AI Bubble Warning?",
        summary: "OpenAI 融資困難的消息導致 AI 記憶體晶片價格下跌，市場對 AI 基礎設施需求的持續性產生懷疑。這不是單純的價格波動，這是資本市場對「AI 投資是否過熱」的第一次集體反思——當最頭部的 AI 公司都融不到錢，整個供應鏈的需求預測都要重新評估。",
        summaryEn: "News of OpenAI's funding difficulties triggered a drop in AI memory chip prices, sparking market doubts about the sustainability of AI infrastructure demand. This isn't just price volatility — it's the capital market's first collective rethink of 'Is AI investment overheated?' When even the top AI company struggles to raise funds, the entire supply chain's demand forecast needs reassessment.",
        why: "這標誌著 AI 硬體軍備競賽可能進入「需求修正期」。對 Micron、SK 海力士來說，這是擴產計畫的警訊；對雲端服務商來說，這是「押注錯誤」的風險提醒；對投資人來說，這是 AI 泡沫論的實證支持。",
        whyEn: "This signals the AI hardware arms race may be entering a 'demand correction phase.' For Micron and SK Hynix, it's a warning for expansion plans; for cloud providers, it's a reminder of 'betting wrong' risks; for investors, it's empirical support for AI bubble theories.",
        source: "The Telegraph",
        url: "https://www.telegraph.co.uk/business/2026/03/29/openai-funding-fears-hit-memory-chip-prices/",
        time: "23:45 TST",
      },
      {
        title: "韓國晶片巨頭加速中國投資，對抗全球 AI 記憶體短缺",
        titleEn: "South Korean Chip Giants Step Up China Investments to Combat Global AI Memory Shortage",
        summary: "三星和 SK 海力士加碼中國 HBM 產能投資，以應對全球 AI 記憶體短缺。這不是地緣政治的妥協，這是經濟理性的選擇——當美國出口管制讓中國市場「自成一格」，韓國廠商選擇「兩邊押注」而非「選邊站」。",
        summaryEn: "Samsung and SK Hynix are increasing HBM capacity investments in China to address the global AI memory shortage. This isn't a geopolitical compromise — it's an economically rational choice. When U.S. export controls make China's market 'self-contained,' Korean manufacturers chose 'hedge both sides' over 'pick a side.'",
        why: "這驗證了「供應鏈分裂」正在加速。對韓國廠商來說，這是風險分散策略；對美國來說，這是盟友「陽奉陰違」的警訊；對中國 AI 產業來說，這是「被迫自主」後的議價權回升。對全球供應鏈來說，這是「效率讓位給政治」的代價。",
        whyEn: "This validates accelerating 'supply chain fragmentation.' For Korean manufacturers, it's risk diversification; for the U.S., it's a warning of allies 'paying lip service'; for China's AI industry, it's restored bargaining power post-'forced independence.' For global supply chains, it's the cost of 'efficiency yielding to politics.'",
        source: "South China Morning Post",
        url: "https://www.scmp.com/tech/tech-trends/article/3348159/south-korean-chip-giants-step-china-investments-combat-global-ai-memory-shortage",
        time: "08:00 TST",
      },
      {
        title: "Kandou AI 獲 2.25 億美元融資：用銅互連技術攻克 AI「記憶體牆」",
        titleEn: "Kandou AI Raises $225M from SoftBank and Synopsys to Solve AI's Memory Wall",
        summary: "Kandou AI 從 SoftBank 和 Synopsys 獲得 2.25 億美元融資，開發銅互連技術以解決 AI 運算的「記憶體牆」瓶頸。這不是另一個 AI 新創故事，這是「用材料科學突破算力極限」的新路線——當 HBM 擴產跟不上需求，改變物理層連接方式成為新賽道。",
        summaryEn: "Kandou AI secured $225M from SoftBank and Synopsys to develop copper interconnect technology solving AI's 'memory wall' bottleneck. This isn't another AI startup story — it's a new path of 'using materials science to break compute limits.' When HBM expansion can't keep pace with demand, changing physical-layer connections becomes a new race.",
        why: "這標誌著 AI 基礎設施創新從「堆更多 HBM」轉向「改變數據傳輸方式」。對 NVIDIA 和 AMD 來說，這是架構層面的挑戰；對記憶體廠商來說，這是「被繞過」的風險；對整個產業來說，這是「瓶頸催生創新」的活教材。",
        whyEn: "This signals AI infrastructure innovation shifting from 'stack more HBM' to 'change data transfer methods.' For NVIDIA and AMD, it's an architectural challenge; for memory makers, it's the risk of being 'bypassed'; for the industry, it's a live case of 'bottlenecks breed innovation.'",
        source: "The Next Web",
        url: "https://thenextweb.com/news/kandou-ai-225m-copper-interconnect-ai-infrastructure",
        time: "01:04 TST",
      },
    ],
    market: "OpenAI 融資困境、韓國晶片廠押注中國、Kandou AI 攻克記憶體牆——三條線索指向同一個結論：AI 基礎設施正在從「瘋狂擴張」轉向「理性修正」。資本開始質疑需求，供應鏈開始分散風險，技術開始尋找新路徑。泡沫論與突破論的拉鋸戰，正式開打。",
    marketEn: "OpenAI funding woes, Korean chipmakers bet on China, Kandou AI tackles memory wall — three threads point to one conclusion: AI infrastructure is shifting from 'frenzied expansion' to 'rational correction.' Capital questions demand, supply chains diversify risk, technology seeks new paths. The tug-of-war between bubble theories and breakthrough narratives has officially begun.",
  },
  {
    date: "2026-03-28",
    items: [
      {
        title: "3/28 尚無重大 AI 動態（截至凌晨）",
        titleEn: "March 28: No Major AI Developments (as of early morning)",
        summary: "3/28（週五）凌晨時段尚無符合報導標準的 AI 新聞發布。主要動態預計在美國工作日時段（台北時間晚間）出現。",
        summaryEn: "March 28 (Friday): No AI news meeting editorial standards as of early morning hours. Major developments expected during U.S. business hours (Taipei evening).",
        why: "重大 AI 發布通常集中在美國西岸工作時間（台北時間晚上至半夜），凌晨時段較少突發新聞。",
        whyEn: "Major AI announcements typically cluster during U.S. West Coast business hours (Taipei evening to midnight); early morning hours see fewer breaking developments.",
        source: "Editorial",
        url: "#",
        time: "01:51 TST",
      },
    ],
    market: "等待美國時段動態更新。",
    marketEn: "Awaiting U.S. hours for updates.",
  },
  {
    date: "2026-03-27",
    items: [
      {
        title: "Apple 打破 OpenAI 獨佔：Siri 將支援 Gemini 和 Claude 路由",
        titleEn: "Apple Breaks OpenAI's Siri Monopoly: Users Can Route Queries to Gemini and Claude",
        summary: "Apple 宣布 Siri 將允許用戶將查詢路由至 Google Gemini 和 Anthropic Claude，打破 OpenAI 的獨家合作地位。這不是技術升級，這是 Apple 在 AI 助手市場的「去單一供應商依賴」戰略——當 OpenAI、Google、Anthropic 都在爭奪入口，Apple 選擇「全都要」。",
        summaryEn: "Apple announced Siri will let users route queries to Google Gemini and Anthropic Claude, breaking OpenAI's exclusive partnership. This isn't a tech upgrade — it's Apple's 'de-single-vendor' strategy in the AI assistant market. With OpenAI, Google, and Anthropic all vying for the gateway, Apple chose 'take them all.'",
        why: "這標誌著 AI 助手入口的競爭白熱化。對 OpenAI 來說，這是失去獨家渠道的警訊；對 Google 和 Anthropic 來說，這是進入 iOS 生態的黃金機會；對用戶來說，這是「模型選擇權」的勝利。對開發者來說，這意味著「多模型適配」成為新常態。",
        whyEn: "This marks the AI assistant gateway race heating up. For OpenAI, it's a warning of losing exclusive channel access; for Google and Anthropic, it's a golden entry into the iOS ecosystem; for users, it's a win for 'model choice.' For developers, multi-model adaptation becomes the new normal.",
        source: "Livemint",
        url: "https://www.livemint.com/technology/tech-news/apple-moves-to-break-openais-siri-monopoly-set-to-allow-users-to-route-siri-queries-to-gemini-and-claude-report-11774588198902.html",
        time: "13:50 TST",
      },
      {
        title: "華為發布新 AI 晶片，正面挑戰 NVIDIA 地盤",
        titleEn: "Huawei Unveils New AI Chip, Directly Targeting NVIDIA's Turf",
        summary: "華為發布新一代 AI 晶片，瞄準 NVIDIA 在訓練與推理市場的主導地位。這不是技術突破的宣言，這是地緣政治驅動的「自主替代」戰略——當美國出口管制切斷 NVIDIA 供應，華為的選擇只有「自己做」。",
        summaryEn: "Huawei launched a new-generation AI chip targeting NVIDIA's dominance in training and inference markets. This isn't a tech breakthrough manifesto — it's a geopolitically-driven 'self-sufficiency replacement' strategy. When U.S. export controls cut off NVIDIA supply, Huawei's only option was 'build it ourselves.'",
        why: "這驗證了「出口管制加速技術自主」的預言。對 NVIDIA 來說，這是失去中國市場的長期代價；對中國 AI 產業來說，這是「被迫獨立」後的成果展示；對全球供應鏈來說，這是「技術冷戰」推動的分裂加速。",
        whyEn: "This validates the 'export controls accelerate tech self-sufficiency' prophecy. For NVIDIA, it's the long-term cost of losing the Chinese market; for China's AI industry, it's the showcase of 'forced independence'; for global supply chains, it's accelerated fragmentation driven by tech cold war.",
        source: "Benzinga",
        url: "https://www.benzinga.com/markets/tech/26/03/51502147/huawei-targets-nvidias-turf-with-new-ai-chip",
        time: "13:50 TST",
      },
      {
        title: "Google Gemini 支援從競品匯入對話記憶：AI 助手「換平台成本」歸零",
        titleEn: "Google Gemini Lets Users Import Memories from Rival Chatbots: AI Assistant 'Switching Cost' Hits Zero",
        summary: "Google Gemini 推出「匯入對話記憶」功能，允許用戶從 ChatGPT、Claude 等競品直接遷移對話歷史與個人化設定。這不是功能更新，這是 Google 用「零遷移成本」策略搶用戶——當 AI 助手的護城河是「用戶習慣」，Google 直接拆掉這道牆。",
        summaryEn: "Google Gemini introduced an 'import conversation memory' feature, letting users migrate chat history and personalized settings from ChatGPT, Claude, and others. This isn't a feature update — it's Google using a 'zero switching cost' strategy to poach users. When AI assistants' moat is 'user habit,' Google just demolished that wall.",
        why: "這改變了 AI 助手市場的競爭規則。對 OpenAI 和 Anthropic 來說，這是「用戶鎖定」優勢被瓦解；對 Google 來說，這是用「數據互操作性」搶奪市場份額的武器；對用戶來說，這是「自由選擇」的勝利，但也意味著「數據隱私」風險上升。",
        whyEn: "This rewrites AI assistant competition rules. For OpenAI and Anthropic, it's the erosion of 'user lock-in' advantage; for Google, it's a weapon to capture market share via 'data interoperability'; for users, it's a win for 'freedom of choice,' but also raises 'data privacy' risks.",
        source: "Economic Times",
        url: "https://economictimes.indiatimes.com/tech/artificial-intelligence/google-gemini-now-lets-users-import-memories-and-chats-from-rival-chatbots/articleshow/129839190.cms",
        time: "13:13 TST",
      },
    ],
    market: "Apple 開放 Siri 多模型選擇、華為自研 AI 晶片、Google 拆掉用戶遷移門檻——三條線索指向同一個結論：AI 產業正在從「獨佔優勢」轉向「開放競爭」，從「技術壁壘」轉向「生態互操作」。護城河正在消失，競爭進入「用戶體驗」和「服務品質」的肉搏戰。",
    marketEn: "Apple opens Siri to multi-model choice, Huawei self-develops AI chips, Google demolishes user migration barriers — three threads point to one conclusion: the AI industry is shifting from 'monopoly advantages' to 'open competition,' from 'tech moats' to 'ecosystem interoperability.' Moats are vanishing; competition enters hand-to-hand combat over 'user experience' and 'service quality.'",
  },
  {
    date: "2026-03-26",
    items: [
      {
        title: "ARM 發布低功耗 AI 晶片計畫，股價單日飆漲 16%",
        titleEn: "ARM Unveils Low-Power AI Chip Roadmap, Stock Surges 16% in One Day",
        summary: "ARM 公布專為邊緣 AI 設計的低功耗晶片架構，強調「核心優勢在低功耗」，引發華爾街分析師大幅上調目標價，股價單日暴漲 16%。這不是 ARM 第一次做晶片，但這是它第一次正面挑戰 NVIDIA 在 AI 推理晶片的地盤——從行動裝置延伸到邊緣運算的戰略卡位。",
        summaryEn: "ARM announced a low-power chip architecture tailored for edge AI, emphasizing its 'core strength in low power,' triggering massive analyst target hikes and a 16% single-day stock surge. This isn't ARM's first chip rodeo, but it's the first time it's directly challenging NVIDIA's AI inference turf — a strategic pivot from mobile to edge computing.",
        why: "邊緣 AI 正在成為下一個戰場——當雲端推理成本居高不下，誰能把 AI 推到裝置端（手機、IoT、車載），誰就掌握下一個十年。ARM 的低功耗優勢是 NVIDIA 的弱點，這場仗會很精彩。對開發者來說，這意味著「多平台適配」的複雜度又上升了。",
        whyEn: "Edge AI is the next battlefield — as cloud inference costs stay prohibitive, whoever pushes AI to the device edge (phones, IoT, automotive) controls the next decade. ARM's low-power edge is NVIDIA's weakness; this fight will be fierce. For developers, multi-platform adaptation complexity just escalated again.",
        source: "Business Insider",
        url: "https://markets.businessinsider.com/news/stocks/arm-s-ai-chip-fits-core-strength-in-low-power-stock-soars-16-on-massive-target-boosts-1035965339",
        time: "07:55 TST",
      },
      {
        title: "Google TurboQuant：AI 記憶體壓縮 6 倍，晶片股應聲下跌",
        titleEn: "Google's TurboQuant: 6x AI Memory Compression Rattles Chip Stocks",
        summary: "Google 發布 TurboQuant 技術，能將 AI 模型的記憶體需求壓縮至原本的 1/6，直接衝擊 HBM（高頻寬記憶體）供應鏈的需求預測，相關晶片股應聲下跌。這不是學術論文，這是 Google 在用「軟體優化」對抗「硬體軍備競賽」——當 Micron、SK 海力士還在擴產 HBM，Google 直接改寫遊戲規則。",
        summaryEn: "Google unveiled TurboQuant, compressing AI model memory requirements to 1/6th, directly disrupting HBM (high-bandwidth memory) demand forecasts and tanking related chip stocks. This isn't an academic paper — it's Google using 'software optimization' to counter the 'hardware arms race.' While Micron and SK Hynix expand HBM capacity, Google is rewriting the rules.",
        why: "這證明了 AI 基礎設施的瓶頸不只能用「買更多硬體」解決，軟體層的突破同樣致命。對雲端服務商來說，這是降本增效的利器；對記憶體廠商來說，這是需求預測的黑天鵝。對 NVIDIA 來說，這是「CUDA 生態」被繞過的警訊。",
        whyEn: "This proves AI infrastructure bottlenecks aren't solved solely by 'buying more hardware' — software breakthroughs are equally lethal. For cloud providers, it's a cost-reduction weapon; for memory makers, it's a demand black swan. For NVIDIA, it's a warning that the 'CUDA moat' can be bypassed.",
        source: "The Next Web",
        url: "https://thenextweb.com/news/google-turboquant-ai-compression-memory-stocks",
        time: "05:06 TST",
      },
      {
        title: "Super Micro Computer 面臨巨大聲譽風險，AI 伺服器供應鏈震盪",
        titleEn: "Super Micro Computer Faces Immense Reputational Risk, AI Server Supply Chain Shaken",
        summary: "AI 伺服器供應商 Super Micro Computer（SMCI）陷入聲譽危機，分析師警告其商譽受損可能影響客戶訂單。這不是財務問題，這是供應鏈信任問題——當 AI 部署對可靠性要求極高，一家供應商的信譽崩塌會直接重塑整個採購決策。",
        summaryEn: "AI server supplier Super Micro Computer (SMCI) is engulfed in a reputational crisis, with analysts warning that damaged trust could tank customer orders. This isn't a financial issue — it's a supply-chain trust issue. When AI deployments demand extreme reliability, one vendor's reputation collapse directly reshapes procurement decisions.",
        why: "AI 伺服器市場正在從「價格戰」轉向「信任戰」。SMCI 的危機對競爭對手（Dell、HPE、Lenovo）是機會，對客戶（AWS、Azure、Google Cloud）是風險分散的提醒。對整個供應鏈來說，這是「單一供應商依賴」風險的活教材。",
        whyEn: "The AI server market is shifting from 'price wars' to 'trust wars.' SMCI's crisis is an opportunity for competitors (Dell, HPE, Lenovo) and a risk-diversification reminder for customers (AWS, Azure, Google Cloud). For the entire supply chain, it's a live case study in single-vendor dependency risk.",
        source: "Seeking Alpha",
        url: "https://seekingalpha.com/article/4885917-super-micro-computer-faces-immense-reputational-risk",
        time: "05:41 TST",
      },
    ],
    market: "ARM 挑戰邊緣 AI、Google 用軟體重塑硬體需求、SMCI 信譽危機——三條線索指向同一個結論：AI 基礎設施競爭正在從「硬體軍備競賽」轉向「技術路線分化」。邊緣 vs 雲端、軟體優化 vs 硬體堆疊、信任 vs 價格——每一個選擇都在重塑產業格局。",
    marketEn: "ARM challenges edge AI, Google uses software to rewrite hardware demand, SMCI's trust crisis — three threads point to one conclusion: AI infrastructure competition is shifting from 'hardware arms race' to 'technical path divergence.' Edge vs. cloud, software optimization vs. hardware stacking, trust vs. price — every choice is reshaping the industry.",
  },
  {
    date: "2026-03-21",
    items: [
      {
        title: "週末無重大 AI 動態",
        titleEn: "Weekend: No Major AI Developments",
        summary: "3/21（週六）無符合報導標準的 AI 新聞發布。產業進入週末靜默期。",
        summaryEn: "March 21 (Saturday): No AI news meeting editorial standards. Industry entered weekend quiet period.",
        why: "週末通常是 AI 產業的靜默期，重大發布集中在週間。",
        whyEn: "Weekends are typically quiet in the AI industry; major announcements cluster on weekdays.",
        source: "Editorial",
        url: "#",
        time: "00:00 TST",
      },
    ],
    market: "週末市場休市，靜待下週動態。",
    marketEn: "Weekend market closed; awaiting next week's developments.",
  },
  {
    date: "2026-03-20",
    items: [
      {
        title: "Google DeepMind 發布 Veo 2.5：AI 影片生成進入「可商用」階段",
        titleEn: "Google DeepMind Unveils Veo 2.5: AI Video Generation Hits Commercial Viability",
        summary: "Google 推出 Veo 2.5，號稱是首個達到「商業部署標準」的 AI 影片生成模型，支援 4K 輸出、8 秒連續生成、物理一致性提升 40%。這不是實驗室 demo，這是 Google 在 AI 影片生成領域對 Runway、Pika 的正面宣戰——從「炫技」到「能賣錢」的分水嶺。",
        summaryEn: "Google launched Veo 2.5, claiming it's the first AI video model meeting 'commercial deployment standards' — 4K output, 8-second continuous generation, 40% improved physics consistency. This isn't a lab demo; it's Google's frontal assault on Runway and Pika, marking the shift from 'flashy tech' to 'monetizable product.'",
        why: "AI 影片生成正在從創作者工具變成內容生產基礎設施。對廣告、短影音平台來說，這是成本結構的顛覆；對創作者來說，這是「技術門檻消失」的焦慮。Google 的入場意味著這個賽道已經到了「規模化競爭」階段。",
        whyEn: "AI video generation is evolving from creator tooling to content production infrastructure. For advertisers and short-video platforms, it's a cost-structure disruption; for creators, it's the anxiety of vanishing technical moats. Google's entry signals the race has hit the 'scale competition' phase.",
        source: "Google DeepMind",
        url: "https://deepmind.google/",
        time: "23:40 TST",
      },
      {
        title: "NVIDIA 資料中心 AI 晶片市佔跌至 65%：異構生態正式成型",
        titleEn: "NVIDIA Data Center AI Chip Share Drops to 65%: Heterogeneous Ecosystem Takes Shape",
        summary: "NVIDIA 在 AI 晶片市場的累積市佔率從 2022 Q1 的 100% 下滑至 2025 Q4 的 65%，AMD、Intel、自研 SoC（如 Google TPU、AWS Trainium）正在蠶食份額。這不是 NVIDIA 衰退，這是市場從「單一供應商壟斷」轉向「異構競爭」的必然結果。",
        summaryEn: "NVIDIA's cumulative AI chip market share fell from 100% in Q1 2022 to 65% in Q4 2025, with AMD, Intel, and custom SoCs (like Google TPU, AWS Trainium) eating into its dominance. This isn't NVIDIA's decline — it's the market's inevitable shift from single-vendor monopoly to heterogeneous competition.",
        why: "對雲端服務商來說，這是「去 NVIDIA 依賴」戰略的驗證——多家供應商意味著議價權回歸。對 NVIDIA 來說，市佔下降不代表營收下降（市場總量爆發），但軟體棧優勢（CUDA）正在被挑戰。對開發者來說，這是「多平台適配」成本上升的開始。",
        whyEn: "For cloud providers, this validates 'de-NVIDIA' strategies — multiple vendors mean restored negotiating power. For NVIDIA, lower share doesn't mean lower revenue (total market exploded), but its software moat (CUDA) is under siege. For developers, multi-platform adaptation costs are rising.",
        source: "Industry Analysis",
        url: "https://radicaldatascience.wordpress.com/2026/03/16/ai-news-briefs-bulletin-board-for-march-2026/",
        time: "23:00 TST",
      },
      {
        title: "xAI 派工程師駐點客戶辦公室：企業 AI 競爭進入「服務戰」",
        titleEn: "xAI Embeds Engineers at Client Sites: Enterprise AI Competition Goes Full-Service",
        summary: "xAI 採用「諮詢式營銷」策略，直派工程團隊進駐潛在企業客戶現場簽約，已拿下 Shifts 支付系統訂單。這是 OpenAI 企業部署手冊的翻版——當模型能力趨同，誰能提供「交付即服務」，誰就贏得企業客戶。",
        summaryEn: "xAI adopted a 'consultative sales' approach, embedding engineering teams directly at prospective enterprise clients to close deals — already landing Shifts payment system. This mirrors OpenAI's enterprise playbook: when model capabilities converge, whoever delivers 'deployment-as-a-service' wins enterprise accounts.",
        why: "企業 AI 市場正在從「賣 API」轉向「賣解決方案」。對新進入者（xAI、Anthropic）來說，這是繞過 OpenAI 先發優勢的唯一路徑；對企業客戶來說，這意味著「供應商綁定」風險上升——選錯平台的轉換成本會很高。",
        whyEn: "Enterprise AI is shifting from 'selling APIs' to 'selling solutions.' For newcomers (xAI, Anthropic), it's the only path around OpenAI's first-mover advantage; for enterprises, it raises 'vendor lock-in' risks — picking the wrong platform will carry high switching costs.",
        source: "AI News",
        url: "https://radicaldatascience.wordpress.com/2026/03/16/ai-news-briefs-bulletin-board-for-march-2026/",
        time: "23:30 TST",
      },
    ],
    market: "AI 影片生成商用化、NVIDIA 市佔下滑、企業 AI 服務化——三條線索指向同一個結論：AI 產業正在從「技術炫耀」轉向「商業落地」，從「壟斷紅利」轉向「異構競爭」，從「賣模型」轉向「賣服務」。下一階段的贏家不是技術最強的，而是商業化最快的。",
    marketEn: "AI video commercialization, NVIDIA share erosion, enterprise AI servitization — three threads point to one conclusion: the AI industry is shifting from 'tech showboating' to 'commercial landing,' from 'monopoly rents' to 'heterogeneous competition,' from 'selling models' to 'selling services.' Next phase winners won't be the most technically advanced — they'll be the fastest to monetize.",
  },
  {
    date: "2026-03-19",
    items: [
      {
        title: "Micron Q2 營收翻三倍：AI 記憶體供不應求的實證",
        titleEn: "Micron Q2 Revenue Triples: AI Memory Shortage Hits Critical Mass",
        summary: "Micron 第二季營收達 137.9 億美元（年增近 3 倍），單季獲利 120.7 億美元。這不是財報數字遊戲——這是 AI 訓練與推理對 HBM（高頻寬記憶體）的瘋狂需求，已經讓供應鏈從「緊張」變成「供不應求」。當 NVIDIA、AMD 都在搶 HBM 產能，Micron、SK 海力士、三星的議價權正在創歷史新高。",
        summaryEn: "Micron posted Q2 revenue of $13.79B (nearly 3x YoY) with $12.07B in quarterly profit. This isn't financial engineering — it's proof that AI training and inference demand for HBM has crossed from 'tight' to 'critical shortage.' With NVIDIA and AMD competing for supply, memory makers now hold unprecedented pricing power.",
        why: "AI 晶片的瓶頸不再只是運算核心，而是記憶體頻寬。這意味著雲端服務商的成本結構正在被重塑——買得到 HBM 的人才有資格談 AI 部署。對投資人來說，這是記憶體廠商黃金期的開始。",
        whyEn: "The bottleneck in AI chips is no longer just compute cores — it's memory bandwidth. Cloud providers' cost structures are being rewritten; only those who can secure HBM can talk about AI deployment. For investors, this marks the beginning of a memory maker golden age.",
        source: "CNBC",
        url: "https://www.cnbc.com/2026/03/18/micron-earnings-are-out-after-the-bell-following-a-big-move-higher-what-analysts-expect.html",
        time: "00:28 TST",
      },
      {
        title: "NVIDIA H200 獲北京批准進入中國市場：地緣科技博弈的新變數",
        titleEn: "NVIDIA's H200 Wins Beijing Approval: Geopolitical Chip Fragmentation Accelerates",
        summary: "NVIDIA 獲得北京批准，將 H200（第二強的 AI 晶片）賣進中國市場，同時正在準備 Groq AI 晶片的中國版本。這不是技術突破，這是地緣政治的現實妥協——美國的出口管制正在逼迫 NVIDIA 「降規生產」，而中國則在用市場准入當籌碼。",
        summaryEn: "NVIDIA secured Beijing's approval to sell H200 (its second-most-powerful AI chip) in China and is adapting Groq chips for the Chinese market. This isn't a tech breakthrough — it's a geopolitical compromise. U.S. export controls are forcing NVIDIA into 'de-rated production,' while China uses market access as leverage.",
        why: "AI 晶片供應鏈正在走向「多版本化」——美國版、中國版、歐洲版。這會增加 NVIDIA 的開發與維護成本，但也意味著「全球單一產品」的時代結束了。對雲端服務商來說，這是供應鏈複雜度的惡夢；對地緣政治分析師來說，這是科技冷戰的新前線。",
        whyEn: "AI chip supply chains are fragmenting into region-specific SKUs — U.S., China, Europe. This increases NVIDIA's development and maintenance costs while ending the era of global single-product dominance. For cloud providers, it's a supply-chain nightmare; for geopolitical analysts, it's the new tech cold war frontline.",
        source: "The Manila Times",
        url: "https://www.manilatimes.net/2026/03/19/business/foreign-business/nvidia-gets-beijings-nod-for-h200-chip-sales-adapts-groq-chip-for-china/2303072",
        time: "00:05 TST",
      },
      {
        title: "比利時 imec 獲得 ASML High NA EUV 設備：歐洲自主晶片製造的關鍵一步",
        titleEn: "Belgium's imec Secures ASML High NA EUV Tool: Europe's Chip Sovereignty Push",
        summary: "比利時晶片研究實驗室 imec 拿到 ASML 最先進的 High NA EUV 微影設備，將用於下一代 AI 晶片試產線。Intel 和 SK 海力士計劃在 2027 年用類似設備量產新 AI 晶片。這不是學術研究，這是歐洲在半導體自主製造上的戰略卡位——不想永遠依賴台積電和三星。",
        summaryEn: "Belgian chip research lab imec acquired ASML's cutting-edge High NA EUV lithography tool for next-gen AI chip pilot production. Intel and SK Hynix plan to deploy similar tools for mass production by 2027. This isn't academic research — it's Europe's strategic move toward semiconductor sovereignty, aiming to reduce dependence on TSMC and Samsung.",
        why: "歐洲正在用「研發先行」策略建立自己的晶片製造能力。短期內不會威脅台積電，但這是歐洲「去依賴化」戰略的重要信號。對 AI 晶片供應商來說，這意味著未來 5-10 年，歐洲客戶會優先考慮「本地製造」選項。",
        whyEn: "Europe is pursuing a 'R&D-first' strategy to build domestic chip manufacturing capacity. It won't threaten TSMC near-term, but signals Europe's de-dependency strategy. For AI chip suppliers, this means European customers will prioritize 'local manufacturing' options within 5-10 years.",
        source: "The Economic Times",
        url: "https://economictimes.indiatimes.com/tech/artificial-intelligence/belgiums-imec-secures-rare-asml-high-na-euv-tool-to-drive-next-generation-chips/articleshow/129661315.cms",
        time: "00:31 TST",
      },
    ],
    market: "AI 記憶體荒正在成為新的「算力瓶頸」，Micron 營收翻倍驗證了這一點。同時，地緣政治正在強制 AI 晶片供應鏈「在地化」——NVIDIA 的中國版晶片、歐洲的自主製造，都在預告一個碎片化的未來。供應鏈效率會下降，但政治風險會分散。",
    marketEn: "AI memory scarcity is becoming the new 'compute bottleneck,' validated by Micron's revenue surge. Meanwhile, geopolitics is forcing AI chip supply chain localization — NVIDIA's China SKUs, Europe's domestic manufacturing — foreshadowing a fragmented future. Supply-chain efficiency will drop, but political risk will diversify.",
  },
  {
    date: "2026-03-18",
    items: [
      {
        title: "OpenAI GPT-4.1 mini 發布：推理效率革命正式開打",
        titleEn: "OpenAI's GPT-4.1 Mini: The Inference Efficiency Wars Begin",
        summary: "OpenAI 推出 GPT-4.1 mini，標榜更快推理速度與更低成本，瞄準高頻 API 工作負載。這不是單純的「小模型」發布——這是 OpenAI 在推理效率戰場上對 Anthropic、Google 的正面宣戰。當 scaling law 的邊際效益遞減，誰能用更少算力做更多事，誰就掌握下一輪定價權。",
        summaryEn: "OpenAI launched GPT-4.1 mini, promising faster inference and lower costs aimed at high-frequency API workloads. This isn't just a small model release — it's a direct challenge to Anthropic and Google on the inference efficiency battlefield. As the marginal returns of scaling laws diminish, whoever does more with less compute controls the next pricing cycle.",
        why: "雲端服務商的推理成本將持續下降，但這也意味著模型供應商的利潤空間正在被壓縮。API 用量會爆發，但單位價值會崩塌——這是規模化的陷阱。",
        whyEn: "Inference costs for cloud providers will keep falling, but that compresses margins for model vendors. API volume will explode while per-unit value collapses — the classic scale trap.",
        source: "OpenAI",
        url: "https://openai.com/blog",
        time: "17:00 TST",
      },
      {
        title: "Meta REA：廣告 AI 從「輔助」變「主導」",
        titleEn: "Meta's REA: Ad AI Goes from Copilot to Autopilot",
        summary: "Meta 發布 REA 自主 AI 代理，能獨立執行廣告排名的機器學習工程任務，不再需要工程師手把手指導。這不是技術 demo，這是 AI Agent 在生產環境的真正落地——從「co-pilot」到「auto-pilot」的分水嶺。",
        summaryEn: "Meta launched REA, an autonomous AI agent capable of independently executing ML engineering tasks for ad ranking — no human supervision required. This isn't a tech demo; it's the real inflection point where agentic AI crosses from assisted to autonomous in production.",
        why: "這證明了 Agentic AI 不是炒作，而是正在改寫雲端服務的自動化程度。對 SaaS 平台來說，這是新一輪的降本增效工具；對工程師來說，這是「被取代」焦慮的具象化。",
        whyEn: "This proves agentic AI isn't hype — it's actively rewriting automation levels in cloud services. For SaaS platforms it's a new cost-reduction lever; for engineers, it's the 'replacement anxiety' made concrete.",
        source: "Meta AI",
        url: "https://ai.meta.com",
        time: "17:00 TST",
      },
      {
        title: "美國司法部：Anthropic 不適合戰鬥系統",
        titleEn: "DOJ: Anthropic Can't Be Trusted for Combat Systems",
        summary: "美國司法部公開表態，認為 Anthropic 無法信任用於軍事戰鬥系統，引發道德 AI 與國防合約的衝突。這不是技術評估，這是政治表態——在 OpenAI 已經向 Pentagon 交出「無限制」模型的背景下，Anthropic 的「安全優先」立場正在被國防體系當成「不合作」標籤。",
        summaryEn: "The DOJ publicly stated that Anthropic cannot be trusted for military combat systems, forcing a collision between ethical AI and defense contracts. This isn't a technical assessment — it's a political signal. With OpenAI already delivering unrestricted models to the Pentagon, Anthropic's safety-first stance is being branded as uncooperative.",
        why: "AI governance 已經不是公司內部的倫理問題，而是地緣政治的籌碼。拒絕軍事合作會被邊緣化，接受軍事合作會失去道德高地——選邊站的時刻到了。",
        whyEn: "AI governance is no longer an internal ethics problem — it's a geopolitical bargaining chip. Refuse military contracts and get marginalized; accept them and lose the moral high ground. The moment to pick a side has arrived.",
        source: "Reuters",
        url: "https://www.reuters.com",
        time: "17:00 TST",
      },
    ],
    market: "AI 基礎設施正在從「更大」轉向「更快」——推理效率成為新戰場，輕量模型的崛起會壓縮巨型模型的利潤空間。軍事應用加速正在重塑產業政治邊界，道德 AI 與國防合約的衝突將持續發酵。",
    marketEn: "AI infrastructure is shifting from 'bigger' to 'faster' — inference efficiency is the new battleground, and lightweight models will compress margins for giants. Accelerating military adoption is redrawing the industry's political boundaries; the ethics-vs-defense conflict will keep fermenting.",
  },
  {
    date: "2026-03-17",
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

// Group digests: current month stays daily, past months fold into monthly groups
export interface MonthGroup {
  key: string;           // e.g. "2026-03"
  label: string;         // e.g. "三月精華" / "March Highlights"
  labelEn: string;
  digests: DailyDigest[];
  isCurrent: boolean;
}

const MONTH_LABELS_ZH = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const MONTH_LABELS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function getGroupedDigests(): MonthGroup[] {
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Group by YYYY-MM
  const map = new Map<string, DailyDigest[]>();
  for (const d of digests) {
    const key = d.date.slice(0, 7); // "2026-03"
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(d);
  }

  const groups: MonthGroup[] = [];
  for (const [key, items] of map) {
    const monthIdx = parseInt(key.split('-')[1], 10) - 1;
    groups.push({
      key,
      label: `${MONTH_LABELS_ZH[monthIdx]}精華`,
      labelEn: `${MONTH_LABELS_EN[monthIdx]} Highlights`,
      digests: items,
      isCurrent: key === currentKey,
    });
  }

  return groups;
}
