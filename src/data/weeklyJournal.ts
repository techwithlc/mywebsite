export type JournalLanguage = 'zh' | 'en';
export type Localized = Record<JournalLanguage, string>;
export interface JournalIssue { id: string; topic: string; status: 'draft' | 'planned' | 'published'; title: Localized; question: Localized; outline: Localized; }
export const weeklyCopy = {
  "zh": {
    "title": "AI 基建現場筆記",
    "eyebrow": "TECHWITHLC / FIELD NOTES",
    "dek": "從晶片到電網，讀懂算力背後的生意。",
    "intro": "我是 Lawrence，在 Visionbay.ai 從事 AI 基礎設施相關工作。這份週刊從工程與營運出發，拆解技術選擇如何影響成本、交付與議價能力。",
    "season": "第一季 · 12 個問題",
    "cadence": "每週一個切面，建立自己的產業判斷。",
    "home": "返回首頁",
    "archive": "週刊目錄",
    "open": "探索週刊",
    "read": "閱讀首期草稿",
    "draft": "草稿",
    "published": "已發表",
    "readPublished": "閱讀本期文章",
    "planned": "規劃中",
    "preview": "首期試閱",
    "latest": "從這一篇開始",
    "all": "全部主題",
    "roadmap": "接下來，沿著這條線追下去。",
    "roadmapNote": "第一季選題規劃；標示「規劃中」的文章尚未發表。",
    "topic": "主題",
    "question": "這期想回答",
    "outline": "研究方向",
    "notPublished": "這一期還在規劃中",
    "notPublishedNote": "以下是選題問題與研究方向，完整文章將在撰寫與查核後加入。",
    "sources": "資料來源",
    "reviewed": "資料查核：2026-11-06",
    "draftNote": "這是第一期草稿，內容仍可修訂。文中觀點為個人分析。",
    "author": "Lawrence Chen · 個人觀察",
    "next": "下一期",
    "back": "回到週刊目錄",
    "chainTitle": "從硬體到服務，需要哪些條件？",
    "chainNote": "交付條件示意；各項工作可以並行，並非固定施工順序。",
    "thesis": "每期追問",
    "pillars": [
      "卡在哪裡？",
      "誰承擔成本？",
      "誰取得議價能力？"
    ],
    "teaser": "把工程現場的問題，寫成能討論的產業觀點。",
    "notFound": "找不到這一期",
    "notFoundNote": "這個期數尚未列入第一季目錄。",
    "theme": "切換深淺色",
    "minute": "約 6 分鐘",
    "footer": "從公開資料出發，把事實、假設與判斷分開。"
  },
  "en": {
    "title": "AI Infrastructure Field Notes",
    "eyebrow": "TECHWITHLC / FIELD NOTES",
    "dek": "From silicon to the grid. The business behind compute.",
    "intro": "I’m Lawrence. I work on AI infrastructure at Visionbay.ai. These notes connect engineering and operations to cost, delivery, and bargaining power.",
    "season": "Season one · 12 questions",
    "cadence": "One perspective each week. A framework that builds over time.",
    "home": "Back to home",
    "archive": "Field notes",
    "open": "Explore the series",
    "read": "Read the first draft",
    "draft": "Draft",
    "published": "Published",
    "readPublished": "Read the issue",
    "planned": "Planned",
    "preview": "First look",
    "latest": "Start here",
    "all": "All topics",
    "roadmap": "Follow the questions behind the buildout.",
    "roadmapNote": "The first-season editorial plan. Issues marked “Planned” have not been published.",
    "topic": "Topic",
    "question": "The question",
    "outline": "Research direction",
    "notPublished": "This issue is being planned",
    "notPublishedNote": "These are research questions and an outline. The full article will be added after writing and source review.",
    "sources": "Sources",
    "reviewed": "Sources reviewed: November 6, 2026",
    "draftNote": "This is a first-issue draft and may be revised. Views are personal analysis.",
    "author": "Lawrence Chen · Personal observations",
    "next": "Next issue",
    "back": "Back to the series",
    "chainTitle": "What connects hardware to a usable service?",
    "chainNote": "Illustrative delivery conditions. Work can proceed in parallel; this is not a fixed construction sequence.",
    "thesis": "The recurring questions",
    "pillars": [
      "What is constrained?",
      "Who bears the cost?",
      "Who gains bargaining power?"
    ],
    "teaser": "Turning engineering questions into industry perspectives worth discussing.",
    "notFound": "Issue not found",
    "notFoundNote": "This issue is not part of the first-season plan.",
    "theme": "Toggle color theme",
    "minute": "About 6 minutes",
    "footer": "Start with public evidence. Keep facts, assumptions, and judgments distinct."
  }
};
export const journalTopics = [
  {
    "id": "power",
    "label": {
      "zh": "電力與土地",
      "en": "Power & land"
    }
  },
  {
    "id": "cooling",
    "label": {
      "zh": "水與散熱",
      "en": "Water & cooling"
    }
  },
  {
    "id": "silicon",
    "label": {
      "zh": "晶片與互連",
      "en": "Silicon & networks"
    }
  },
  {
    "id": "capital",
    "label": {
      "zh": "資本與商業",
      "en": "Capital & business"
    }
  },
  {
    "id": "operations",
    "label": {
      "zh": "部署與營運",
      "en": "Delivery & operations"
    }
  }
];
export const journalIssues: JournalIssue[] = [
  {
    "id": "01",
    "topic": "operations",
    "status": "draft",
    "title": {
      "zh": "買到 GPU，距離交付算力還有多遠？",
      "en": "You bought the GPUs. When can customers use them?"
    },
    "question": {
      "zh": "從設備採購到客戶可用，中間有哪些必要條件？",
      "en": "What stands between buying hardware and delivering a usable service?"
    },
    "outline": {
      "zh": "把供電、散熱、系統驗收與客戶工作負載放在同一張圖上。",
      "en": "Map power, cooling, system acceptance, and customer workloads together."
    }
  },
  {
    "id": "02",
    "topic": "power",
    "status": "planned",
    "title": {
      "zh": "AI 資料中心搶的電，是電價還是時間？",
      "en": "The race for power: price, or time?"
    },
    "question": {
      "zh": "供電合約、併網與實際送電，差別在哪裡？",
      "en": "How do a power contract, a grid connection, and live power differ?"
    },
    "outline": {
      "zh": "比較電力取得的里程碑，以及延誤由誰承擔。",
      "en": "Compare power-delivery milestones and who bears the cost of delay."
    }
  },
  {
    "id": "03",
    "topic": "power",
    "status": "planned",
    "title": {
      "zh": "土地便宜，為什麼不一定適合蓋 AI 資料中心？",
      "en": "Cheap land. But can you build an AI data center there?"
    },
    "question": {
      "zh": "土地、供電、光纖與許可如何一起影響選址？",
      "en": "How do land, power, fiber, and permits interact in site selection?"
    },
    "outline": {
      "zh": "用有條件的選址矩陣，辨認真正影響交付的限制。",
      "en": "Build a conditional site-selection matrix around delivery constraints."
    }
  },
  {
    "id": "04",
    "topic": "cooling",
    "status": "planned",
    "title": {
      "zh": "液冷是不是就會耗更多水？",
      "en": "Does liquid cooling necessarily consume more water?"
    },
    "question": {
      "zh": "晶片冷卻迴路與設施排熱的用水如何區分？",
      "en": "How do chip cooling and facility heat rejection differ in water use?"
    },
    "outline": {
      "zh": "畫出水流與熱流，分清循環用水、取水與耗水。",
      "en": "Map water and heat flows; distinguish circulation, withdrawal, and consumption."
    }
  },
  {
    "id": "05",
    "topic": "silicon",
    "status": "planned",
    "title": {
      "zh": "從 GPU 到整櫃：IC 架構如何改變部署？",
      "en": "From GPU to rack: how chip architecture changes deployment"
    },
    "question": {
      "zh": "HBM、封裝與互連的限制如何傳到系統設計？",
      "en": "How do HBM, packaging, and interconnect constraints reach system design?"
    },
    "outline": {
      "zh": "沿著晶片、托盤與機櫃，追蹤效能條件與設施需求。",
      "en": "Trace performance conditions and facility requirements from silicon to rack."
    }
  },
  {
    "id": "06",
    "topic": "silicon",
    "status": "planned",
    "title": {
      "zh": "InfiniBand 與 Ethernet，該怎麼比較？",
      "en": "How should we compare InfiniBand and Ethernet?"
    },
    "question": {
      "zh": "工作負載、拓撲與維運條件如何影響網路選擇？",
      "en": "How do workloads, topology, and operations affect network choices?"
    },
    "outline": {
      "zh": "建立情境化比較，避免只憑名目頻寬判斷。",
      "en": "Compare concrete scenarios rather than nominal bandwidth alone."
    }
  },
  {
    "id": "07",
    "topic": "operations",
    "status": "planned",
    "title": {
      "zh": "GPU 忙碌，等於算力有效嗎？",
      "en": "Busy GPUs. Useful compute?"
    },
    "question": {
      "zh": "設備利用率、有效運算與付費使用如何區分？",
      "en": "How do hardware utilization, useful computation, and paid usage differ?"
    },
    "outline": {
      "zh": "把量測邊界與客戶實際得到的成果對齊。",
      "en": "Align measurement boundaries with the outcomes customers receive."
    }
  },
  {
    "id": "08",
    "topic": "operations",
    "status": "planned",
    "title": {
      "zh": "推論的成本，為何不能只看 GPU 時租？",
      "en": "Inference economics beyond the GPU hourly rate"
    },
    "question": {
      "zh": "延遲、吞吐、批次與服務品質如何改變成本？",
      "en": "How do latency, throughput, batching, and service quality affect cost?"
    },
    "outline": {
      "zh": "在明列模型與服務目標的條件下比較單位成本。",
      "en": "Compare unit costs under explicit model and service-level assumptions."
    }
  },
  {
    "id": "09",
    "topic": "capital",
    "status": "planned",
    "title": {
      "zh": "AI 基建的資金鏈：誰先付錢，誰承擔風險？",
      "en": "The funding chain: who pays first, and who bears the risk?"
    },
    "question": {
      "zh": "股權、借款、設備與客戶長約如何連在一起？",
      "en": "How do equity, debt, equipment, and customer commitments connect?"
    },
    "outline": {
      "zh": "以公開申報文件追蹤資金流，不把訂單直接當現金。",
      "en": "Trace funding with public filings; distinguish commitments from cash."
    }
  },
  {
    "id": "10",
    "topic": "capital",
    "status": "planned",
    "title": {
      "zh": "GPU、廠房與借款，三種時間如何對齊？",
      "en": "GPUs, buildings, and debt run on different clocks"
    },
    "question": {
      "zh": "設備迭代、資產年限與償債期不一致會怎樣？",
      "en": "What happens when hardware cycles, asset lives, and debt maturities diverge?"
    },
    "outline": {
      "zh": "建立標示假設的時間軸與敏感度情境。",
      "en": "Build explicit timelines and sensitivity scenarios."
    }
  },
  {
    "id": "11",
    "topic": "operations",
    "status": "planned",
    "title": {
      "zh": "機櫃交付以後，誰讓它持續產生收入？",
      "en": "After rack delivery, what keeps the service earning?"
    },
    "question": {
      "zh": "軟體、排程、維運與支援如何影響交付？",
      "en": "How do software, scheduling, operations, and support affect delivery?"
    },
    "outline": {
      "zh": "從硬體可用走到客戶願意持續付費。",
      "en": "Follow the path from available hardware to a service customers keep paying for."
    }
  },
  {
    "id": "12",
    "topic": "capital",
    "status": "planned",
    "title": {
      "zh": "三個月後，我對 AI 基建改變了哪些看法？",
      "en": "Three months later: which views held up?"
    },
    "question": {
      "zh": "哪些假說得到支持，哪些需要修正？",
      "en": "Which hypotheses gained support, and which need revision?"
    },
    "outline": {
      "zh": "回看證據與反例，留下下一季值得追蹤的問題。",
      "en": "Review evidence and counterexamples; identify questions for season two."
    }
  }
];
export const journalSources = [
  {
    "id": "iea-grid",
    "title": {
      "zh": "IEA：AI 與能源安全（2025）",
      "en": "IEA: AI and energy security (2025)"
    },
    "url": "https://www.iea.org/reports/energy-and-ai/ai-and-energy-security"
  },
  {
    "id": "nvidia",
    "title": {
      "zh": "NVIDIA：DGX GB300 系統介紹",
      "en": "NVIDIA: DGX GB300 system overview"
    },
    "url": "https://www.nvidia.com/en-us/data-center/dgx-gb300/"
  },
  {
    "id": "doe",
    "title": {
      "zh": "美國能源部：資料中心冷卻用水效率",
      "en": "US DOE: Cooling water efficiency for data centers"
    },
    "url": "https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers"
  },
  {
    "id": "coreweave",
    "title": {
      "zh": "CoreWeave：2025 年度 Form 10-K",
      "en": "CoreWeave: FY2025 Form 10-K"
    },
    "url": "https://www.sec.gov/Archives/edgar/data/1769628/000176962826000104/crwv-20251231.htm"
  }
];
export const firstIssueSections = [
  {
    "title": {
      "zh": "買到設備，只完成了交付條件的一部分",
      "en": "Hardware procurement is one part of delivery"
    },
    "paragraphs": [
      {
        "zh": "如果今天有一批 GPU 交貨，你會用哪一天當成這個專案的成功？設備到貨、機櫃送電，還是客戶的第一個工作負載真正跑起來？這三個時間點，回答的是不同問題。",
        "en": "If a shipment of GPUs arrived today, which date would define success: delivery, power-on, or the first usable customer workload? Those milestones answer different questions."
      },
      {
        "zh": "我在 Visionbay.ai 從事 AI 基礎設施相關工作。這份週刊想從一個問題開始：硬體規格，如何一步步變成客戶能使用的服務？我的判斷是，評估 AI 基建時，值得同時看設備、設施、系統與客戶需求之間的配合。",
        "en": "I work on AI infrastructure at Visionbay.ai. I want to begin this series with a question: how do hardware specifications become a service customers can use? My working view is that we need to examine the fit between equipment, facilities, systems, and customer demand."
      }
    ],
    "sourceIds": []
  },
  {
    "title": {
      "zh": "電力的問題，也包含「什麼時候」",
      "en": "Power is also a question of when"
    },
    "paragraphs": [
      {
        "zh": "IEA 在《Energy and AI》的能源安全章節指出，資料中心擴張面臨電網連接延誤的風險，一些地區的連接申請已有積壓。這支持一個基本區分：有電力需求，與在需要的時間取得可用供電，是兩回事。",
        "en": "The energy-security chapter of IEA’s Energy and AI identifies grid-connection delays as a risk to data-center expansion, including backlogs in some jurisdictions. Power demand and usable power at the required time are distinct."
      },
      {
        "zh": "我的推論是：讀到一個擴建計畫時，應追問它到了哪個里程碑。簽約、核准、設備就緒、正式送電，不能混成同一件事。如果其他投入已經發生，延後上線可能改變資金占用與客戶交付安排；實際影響仍取決於合約。",
        "en": "My inference is that expansion plans should be evaluated by milestone. Contracts, approvals, equipment readiness, and live power should not be conflated. If other investments have already been made, delays may change capital tied up and customer delivery arrangements; the actual effects depend on contracts."
      }
    ],
    "sourceIds": [
      "iea-grid"
    ]
  },
  {
    "title": {
      "zh": "散熱，要把邊界畫完整",
      "en": "Draw the whole cooling boundary"
    },
    "paragraphs": [
      {
        "zh": "NVIDIA 將 DGX GB300 描述為機櫃級液冷系統。這告訴我們部署時需要考慮冷卻配套，但不能單憑「液冷」兩字就推定整座設施的耗水量。",
        "en": "NVIDIA describes DGX GB300 as a rack-scale, liquid-cooled system. That establishes a cooling requirement for deployment, but “liquid-cooled” alone does not establish a facility’s water consumption."
      },
      {
        "zh": "美國能源部的資料中心用水指引，將冷卻塔、冷卻方式、氣候與控制條件一起討論。這也是我想保留的分析習慣：晶片附近的熱怎麼被帶走，與設施最後如何把熱排到外界，要分開看，再接起來。",
        "en": "US DOE guidance discusses cooling towers, cooling methods, climate, and operating controls together. The analytical habit I want to retain is to distinguish how heat leaves the chip from how the facility ultimately rejects it, then connect those boundaries."
      },
      {
        "zh": "對一塊候選土地也一樣：假設地價便宜，但供電與冷卻條件仍不確定，單看土地價格就不足以判斷交付能力。要比較的是完整方案及其限制。",
        "en": "The same applies to a hypothetical site: if land is cheap but power and cooling readiness remain uncertain, price alone cannot establish delivery capability. The comparison needs the complete proposal and its constraints."
      }
    ],
    "sourceIds": [
      "nvidia",
      "doe"
    ]
  },
  {
    "title": {
      "zh": "資本角力，先看誰承擔哪一段風險",
      "en": "Follow the allocation of risk"
    },
    "paragraphs": [
      {
        "zh": "以歷史文件為例，CoreWeave 的 2025 年度 Form 10-K 說明，其基建融資主要採用由 take-or-pay 客戶合約支持的資產層級借款，並搭配公司層級的股權與債務。這是特定公司的年度揭露，不代表所有算力業者都採用相同結構。",
        "en": "As a historical example, CoreWeave’s FY2025 Form 10-K describes infrastructure financing primarily through asset-level debt supported by take-or-pay customer contracts, supplemented by corporate equity and debt. This is one company’s annual disclosure, not a universal industry structure."
      },
      {
        "zh": "這帶出我想持續追的問題：設備、電力與客戶付款的時程是否對得上？誰承擔延遲？誰承擔沒有用滿的風險？有需求、有合約、有現金流，應該分別檢查。至於誰能取得較好的議價能力，還得看替代方案、競爭與合約條件。",
        "en": "The questions I want to follow are whether equipment, power, and customer payments line up; who bears delay; and who bears underuse. Demand, commitments, and cash flow deserve separate checks. Bargaining power still depends on alternatives, competition, and contract terms."
      }
    ],
    "sourceIds": [
      "coreweave"
    ]
  },
  {
    "title": {
      "zh": "下一次看擴建新聞，我會問這三件事",
      "en": "Three questions for the next expansion announcement"
    },
    "paragraphs": [
      {
        "zh": "第一，報導中的容量是規劃、簽約、已送電，還是客戶已可使用？第二，哪一個尚未完成的條件，最可能影響交付？第三，如果那個條件延誤，成本會落到誰身上？",
        "en": "First: is the reported capacity planned, contracted, powered, or available to customers? Second: which unfinished condition is most likely to affect delivery? Third: if it is delayed, who bears the cost?"
      },
      {
        "zh": "這個框架也有邊界。如果設施已成熟，真正的限制可能轉到軟體、客戶導入或需求本身。我不預設每個專案都缺電、缺水，也不預設掌握瓶頸就一定能賺到超額利潤。接下來十二期，我想用公開資料逐步檢驗這些問題。",
        "en": "This framework has limits. In a mature facility, the constraint may instead be software, customer onboarding, or demand itself. I do not assume every project lacks power or water, or that controlling a bottleneck guarantees excess profit. Over twelve issues, I want to test these questions against public evidence."
      }
    ],
    "sourceIds": []
  }
];
export const deliveryChain = [
  {
    "zh": "設備到位",
    "en": "Equipment ready"
  },
  {
    "zh": "供電與散熱",
    "en": "Power & cooling"
  },
  {
    "zh": "系統驗收",
    "en": "System acceptance"
  },
  {
    "zh": "客戶可用",
    "en": "Customer-ready"
  }
];

// Each issue has its own article; planned issues do not render placeholder prose.
export const journalArticles: Record<string, typeof firstIssueSections> = { "01": firstIssueSections };

export const infrastructureCopy = {
  "zh": {
    "navJournal": "週刊",
    "navAbout": "關於作者",
    "subtitle": "AI INFRASTRUCTURE JOURNAL",
    "heroLine": "AI 的下一步，\n從基礎設施讀起。",
    "heroBody": "電力、晶片、散熱與資本。從工程現場出發，追蹤 AI 算力背後的實體世界與商業邏輯。",
    "heroByline": "Lawrence Chen / Visionbay.ai",
    "diagram": "AI 基建五層立體概念圖：能源、晶片、基礎設施、模型與應用",
    "diagramNote": "概念示意，非實際機房配置。",
    "diagramTag": "研究視角",
    "diagramFooter": "能源 → 運算 → 服務 → 價值",
    "latest": "本期筆記",
    "archiveTitle": "每週一個問題。\n把基建的全貌拼起來。",
    "archiveLabel": "週刊目錄",
    "aboutLabel": "作者 / 背景",
    "aboutTitle": "在工程與商業之間，\n把問題問得更深一點。",
    "aboutBody": "我是 Lawrence，在 Visionbay.ai 從事 AI 基礎設施相關工作。過去的雲端支援與 SRE 經驗，讓我關注設備上線之後，如何成為穩定、可交付的服務。這裡記錄我對 AI 基建的個人觀察。",
    "experience": "經歷",
    "education": "學歷",
    "present": "至今",
    "columbiaDegree": "碩士，作業研究（Operations Research）",
    "columbiaDates": "2024 年 8 月 — 2025 年 9 月",
    "columbiaActivities": "活動與社團：Program",
    "tunghai": "東海大學",
    "tunghaiDegree": "學士，資訊管理",
    "tunghaiDates": "2016 年 9 月 — 2020 年 7 月",
    "linkedin": "LinkedIn",
    "email": "聯絡我",
    "visionRole": "資深 AI 雲端維運工程師",
    "cathay": "國泰金融控股",
    "cathayRole": "資深 SRE 工程師",
    "awsRole": "雲端支援工程師 · Dublin",
    "independent": "獨立雲端架構師",
    "independentOrg": "自雇 · 亞太區",
    "founder": "TechwithLC 創辦人",
    "copyright": "Lawrence Chen. 個人觀點。",
    "logoAlt": "Columbia University 校徽",
    "research": "研究主題",
    "sectionTag": "第一季 / 編輯規劃"
  },
  "en": {
    "navJournal": "Journal",
    "navAbout": "About",
    "subtitle": "AI INFRASTRUCTURE JOURNAL",
    "heroLine": "The next chapter of AI\nstarts with infrastructure.",
    "heroBody": "Power, silicon, cooling, and capital. Following the physical systems and business decisions that turn AI compute into a service.",
    "heroByline": "Lawrence Chen / Visionbay.ai",
    "diagram": "Five-layer AI infrastructure illustration: energy, chips, infrastructure, models, and applications",
    "diagramNote": "Conceptual illustration, not an actual facility layout.",
    "diagramTag": "Research perspectives",
    "diagramFooter": "ENERGY → COMPUTE → SERVICE → VALUE",
    "latest": "Featured field note",
    "archiveTitle": "One question a week.\nA clearer view of the whole system.",
    "archiveLabel": "The journal",
    "aboutLabel": "AUTHOR / BACKGROUND",
    "aboutTitle": "Between engineering and business,\nask the next question.",
    "aboutBody": "I’m Lawrence. I work on AI infrastructure at Visionbay.ai. My cloud support and SRE background shapes the questions I ask: how does installed equipment become a reliable, deliverable service? These are my personal notes on the AI buildout.",
    "experience": "Experience",
    "education": "Education",
    "present": "Present",
    "columbiaDegree": "Master’s degree, Operations Research",
    "columbiaDates": "Aug 2024 — Sep 2025",
    "columbiaActivities": "Activities and societies: Program",
    "tunghai": "Tunghai University",
    "tunghaiDegree": "B.S. Information Management",
    "tunghaiDates": "Sep 2016 — Jul 2020",
    "linkedin": "LinkedIn",
    "email": "Get in touch",
    "visionRole": "Senior AI Cloud Operation Engineer",
    "cathay": "Cathay Financial Holdings",
    "cathayRole": "Senior Site Reliability Engineer",
    "awsRole": "Cloud Support Engineer · Dublin",
    "independent": "Independent Cloud Architect",
    "independentOrg": "Self-employed · APAC",
    "founder": "Founder of TechwithLC",
    "copyright": "Lawrence Chen. Personal perspectives.",
    "logoAlt": "Columbia University logo",
    "research": "Research topics",
    "sectionTag": "SEASON 01 / EDITORIAL PLAN"
  }
};

export const infrastructureLayers = [
  {
    "id": "05",
    "title": "Applications",
    "description": {
      "zh": "產業應用",
      "en": "Industry applications"
    }
  },
  {
    "id": "04",
    "title": "Models",
    "description": {
      "zh": "模型與推論",
      "en": "Models & inference"
    }
  },
  {
    "id": "03",
    "title": "Infrastructure",
    "description": {
      "zh": "算力調度與網路隔離",
      "en": "Compute & networking"
    }
  },
  {
    "id": "02",
    "title": "Chips",
    "description": {
      "zh": "加速運算基礎",
      "en": "Accelerated computing"
    }
  },
  {
    "id": "01",
    "title": "Energy",
    "description": {
      "zh": "電力與散熱基礎",
      "en": "Power & cooling"
    }
  }
];
