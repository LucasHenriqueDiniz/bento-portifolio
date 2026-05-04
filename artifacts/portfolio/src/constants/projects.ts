export interface Project {
  id: string;
  name: string;

  description: string;
  highlight: string;

  descriptionEn: string;
  highlightEn: string;

  techStack: string[];
  url?: string;
  repoUrl?: string;
  storeUrl?: string;
  featured?: boolean;
  status?: "workInProgress" | "discontinued" | "experimental" | "completed";
  image?: string;
  images?: string[];
  showInDonate?: boolean;
  category: "website" | "software" | "extension";

  role?: string;
  roleEn?: string;
  type?: string;
  typeEn?: string;
  year?: string;
  priority?: number;
}

export const projects: Project[] = [
  {
    id: "heartopia-guide",
    name: "Heartopia Guide",
    description:
      "• Construí uma plataforma de conteúdo em produção com Next.js App Router e rotas dinâmicas\n" +
      "• Estruturei guias, eventos e páginas indexáveis com foco em SEO e manutenção\n" +
      "• Trabalhei em cache, sitemap, metadados e otimizações para reduzir custo de rotas dinâmicas",
    descriptionEn:
      "• Built a production content platform with Next.js App Router and dynamic routes\n" +
      "• Structured guides, events and indexable pages with SEO and maintainability in mind\n" +
      "• Worked on caching, sitemap, metadata and optimizations to reduce dynamic route cost",
    techStack: ["Next.js", "TypeScript", "SEO", "App Router"],
    highlight: "Plataforma de conteúdo em produção com arquitetura focada em SEO",
    highlightEn: "Production content platform with SEO-focused architecture",
    url: "https://heartopia.guide/en",
    repoUrl: "https://github.com/LucasHenriqueDiniz/heartopia-guide",
    featured: true,
    status: "completed",
    category: "website",
    role: "Desenvolvedor fullstack solo",
    roleEn: "Solo fullstack developer",
    type: "Plataforma de conteúdo",
    typeEn: "Content platform",
    year: "2025-2026",
    priority: 1,
    image: "/projects/heartopiaguide.webp",
    showInDonate: true,
    images: [
      "/projects/heartopiaguide.webp",
      "/projects/heartopia-guide-2.webp",
      "/projects/heartopia-guide-3.webp",
      "/projects/heartopia-guide-4.webp",
    ],
  },
  {
    id: "clearcut",
    name: "ClearCut",
    description:
      "• Construí um app desktop para remoção de fundo, processamento em lote e exportação de imagens\n" +
      "• Implementei fluxo local com Tauri, FastAPI, Pillow, rembg e controles de exportação\n" +
      "• Adicionei fila por arquivo, editor de máscara, regras de nomeação e saída em pasta ou ZIP",
    descriptionEn:
      "• Built a desktop app for background removal, batch processing and image exports\n" +
      "• Implemented a local workflow with Tauri, FastAPI, Pillow, rembg and export controls\n" +
      "• Added per-file queue states, mask editor, naming rules and folder/ZIP output",
    techStack: ["Tauri", "Next.js", "TypeScript", "FastAPI", "Image Processing"],
    highlight: "App desktop para processamento de imagens, remoção de fundo e exportação em lote",
    highlightEn: "Desktop image processing app for background removal and batch exports",
    repoUrl: "https://github.com/LucasHenriqueDiniz/clearcut",
    featured: true,
    status: "workInProgress",
    category: "software",
    role: "Desenvolvedor fullstack solo",
    roleEn: "Solo fullstack developer",
    type: "Aplicativo desktop",
    typeEn: "Desktop application",
    year: "2026",
    priority: 3,
    image: "/projects/clearcut.webp",
  },
  {
    id: "esp-web-flasher",
    name: "ESP Web Flasher",
    description:
      "• Construí um instalador web de firmware para ESP32/ESP8266 usando Web Serial API\n" +
      "• Adicionei monitor serial com suporte a logs ANSI e envio de comandos pelo navegador\n" +
      "• Integrei esptool-js para reduzir dependência de instaladores nativos no onboarding de dispositivos",
    descriptionEn:
      "• Built a web-based firmware installer for ESP32/ESP8266 using the Web Serial API\n" +
      "• Added a serial monitor with ANSI log support and browser-based command input\n" +
      "• Integrated esptool-js to reduce native installer dependency during device onboarding",
    techStack: ["React", "TypeScript", "Web Serial API", "ESP32", "Material UI"],
    highlight: "Instalação de firmware e monitor serial para ESP32/ESP8266 direto pelo navegador",
    highlightEn: "Browser-based firmware flashing and serial monitor for ESP32/ESP8266",
    repoUrl: "https://github.com/LucasHenriqueDiniz/siot-web-flasher",
    featured: false,
    status: "completed",
    category: "software",
    role: "Desenvolvedor frontend / IoT web tooling",
    roleEn: "Frontend developer / IoT web tooling",
    type: "Ferramenta IoT",
    typeEn: "IoT tooling",
    year: "2025",
    priority: 7,
    image: "/projects/esp-web-flasher.webp",
  },
  {
    id: "weeb-profile",
    name: "Weeb Profile",
    description:
      "• Construí um sistema de geração dinâmica de SVG para GitHub README com plugins configuráveis\n" +
      "• Integrei GitHub, Last.fm e MyAnimeList para renderizar estatísticas e cards customizados\n" +
      "• Automatizei coleta, geração e publicação via GitHub Actions e armazenamento em Gist/repositório",
    descriptionEn:
      "• Built a dynamic SVG generation system for GitHub READMEs with configurable plugins\n" +
      "• Integrated GitHub, Last.fm and MyAnimeList to render statistics and custom cards\n" +
      "• Automated collection, generation and publishing through GitHub Actions and Gist/repository storage",
    techStack: ["Node.js", "TypeScript", "GitHub Actions", "SVG", "API Integration"],
    highlight: "Geração dinâmica de SVG com plugins, múltiplas APIs e pipeline no GitHub Actions",
    highlightEn: "Dynamic SVG generation with plugins, multiple APIs and GitHub Actions pipeline",
    url: "https://weeb-profile-web-client.vercel.app/",
    repoUrl: "https://github.com/LucasHenriqueDiniz/WeebProfile",
    featured: true,
    status: "workInProgress",
    category: "website",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Ferramenta para GitHub README",
    typeEn: "GitHub README tool",
    year: "2024-2026",
    priority: 8,
    image: "/projects/weebprofile.webp",
    showInDonate: true,
  },
  {
    id: "context-tools",
    name: "Context Tools",
    description:
      "• Publiquei uma extensão VS Code para copiar contexto de código em formato amigável para LLMs\n" +
      "• Implementei cópia de arquivo atual, seleção, editores abertos, arquivos selecionados e árvore do projeto\n" +
      "• Adicionei suporte a Problems/diagnostics, filtros de árvore e formatação em blocos Markdown",
    descriptionEn:
      "• Published a VS Code extension for copying code context in LLM-friendly formats\n" +
      "• Implemented copying for current file, selection, open editors, selected files and project tree\n" +
      "• Added Problems/diagnostics support, tree filters and Markdown block formatting",
    techStack: ["TypeScript", "VS Code API", "Extension"],
    highlight: "Extensão VS Code para copiar contexto de código para LLMs e issues",
    highlightEn: "VS Code extension for copying code context into LLMs and issues",
    url: "https://marketplace.visualstudio.com/items?itemName=lucashenriquediniz.vscode-context-tools",
    repoUrl: "https://github.com/LucasHenriqueDiniz/vscode-context-tools",
    featured: true,
    status: "completed",
    category: "extension",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Extensão VS Code",
    typeEn: "VS Code extension",
    year: "2025",
    priority: 6,
    image: "/projects/contexttools.webp",
    showInDonate: true,
  },
  {
    id: "mannco-enhancer",
    name: "Mannco Enhancer",
    description:
      "• Construí uma extensão Manifest V3 para melhorar fluxos de trading na Mannco.store\n" +
      "• Adicionei overlays, atalhos de inventário, referência de preços externos e calculadoras de lucro\n" +
      "• Implementei toggles por feature, defaults seguros e proteção contra ações destrutivas automáticas",
    descriptionEn:
      "• Built a Manifest V3 extension to improve trading workflows on Mannco.store\n" +
      "• Added overlays, inventory shortcuts, external price references and profit calculators\n" +
      "• Implemented per-feature toggles, safe defaults and protection against destructive automatic actions",
    techStack: ["TypeScript", "Manifest V3", "Browser Extension", "Chrome API"],
    highlight: "Extensão para otimizar trading e navegação na Mannco.store",
    highlightEn: "Browser extension improving trading and navigation on Mannco.store",
    repoUrl: "https://github.com/LucasHenriqueDiniz/mannco-enhancer",
    featured: false,
    status: "completed",
    category: "extension",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Extensão de navegador",
    typeEn: "Browser extension",
    year: "2026",
    priority: 12,
    image: "/projects/mannco-enhancer.webp",
    showInDonate: true,
  },
  {
    id: "instagram-enhancer",
    name: "Instagram Enhancer",
    description:
      "• Construí uma extensão Manifest V3 para adicionar controles avançados ao Instagram Web\n" +
      "• Implementei download de mídia, controles de vídeo, customização visual e filtros de distração\n" +
      "• Adicionei exportação de seguidores/comentários e modo de performance com bloqueio seguro de requests",
    descriptionEn:
      "• Built a Manifest V3 extension that adds advanced controls to Instagram Web\n" +
      "• Implemented media downloads, video controls, visual customization and distraction filters\n" +
      "• Added follower/comment exports and a performance mode with safe request blocking behavior",
    techStack: ["TypeScript", "Manifest V3", "Browser Extension", "Chrome API"],
    highlight: "Extensão para download de mídia, ajustes visuais e controles avançados no Instagram Web",
    highlightEn: "Extension for media downloads, visual tweaks and advanced controls on Instagram Web",
    repoUrl: "https://github.com/LucasHenriqueDiniz/instagram-enhancer",
    featured: true,
    status: "completed",
    category: "extension",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Extensão de navegador",
    typeEn: "Browser extension",
    year: "2026",
    priority: 4,
    image: "/projects/instagram-enhancer.webp",
    showInDonate: true,
  },
  {
    id: "include-gurias",
    name: "Include Gurias",
    description:
      "• Construí uma plataforma institucional fullstack com abordagem de headless CMS customizado\n" +
      "• Implementei autenticação, dashboard administrativo e CRUD para gerenciamento de conteúdo\n" +
      "• Modelei banco no Supabase/PostgreSQL com políticas RLS e camada de cache estratégica",
    descriptionEn:
      "• Built a fullstack institutional platform with a custom headless CMS approach\n" +
      "• Implemented authentication, admin dashboard and CRUD for content management\n" +
      "• Modeled Supabase/PostgreSQL data with RLS policies and a strategic caching layer",
    techStack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL"],
    highlight: "Plataforma institucional fullstack com CMS customizado e dashboard administrativo",
    highlightEn: "Fullstack institutional platform with custom CMS and admin dashboard",
    url: "https://www.includegurias.com.br",
    repoUrl: "https://github.com/include-gurias/includegurias-website",
    featured: true,
    status: "completed",
    category: "website",
    role: "Desenvolvedor fullstack",
    roleEn: "Fullstack developer",
    type: "Site institucional / CMS",
    typeEn: "Institutional website / CMS",
    year: "2024",
    priority: 5,
    image: "/projects/include-gurias.webp",
    images: [
      "/projects/include-gurias.webp",
      "/projects/include-gurias-2.webp",
      "/projects/include-gurias-3.webp",
    ],
  },
  {
    id: "windows-xp-online",
    name: "Windows XP Online",
    description:
      "• Construí uma recriação do Windows XP no navegador com janelas arrastáveis e redimensionáveis\n" +
      "• Implementei estado compartilhado em tempo real usando Firebase\n" +
      "• Recriei interações clássicas de desktop, multitarefa, temas, sons e comportamento visual nostálgico",
    descriptionEn:
      "• Built a Windows XP recreation in the browser with draggable and resizable windows\n" +
      "• Implemented realtime shared state using Firebase\n" +
      "• Recreated classic desktop interactions, multitasking, themes, sounds and nostalgic visual behavior",
    techStack: ["Next.js", "React", "TypeScript", "Firebase"],
    highlight: "Recriação do Windows XP no navegador com janelas e sincronização em tempo real",
    highlightEn: "Browser-based Windows XP recreation with windows and realtime sync",
    url: "https://w-xp-online.web.app/",
    repoUrl: "https://github.com/LucasHenriqueDiniz/windowx-xp-online",
    featured: false,
    status: "experimental",
    category: "website",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Experimento web interativo",
    typeEn: "Interactive web experiment",
    year: "2025",
    priority: 13,
    image: "/projects/windows_xp_online.webp",
  },
  {
    id: "simple-overlay-timer",
    name: "Overlay Timer",
    description:
      "• Construí um timer/cronômetro overlay para Windows usando Tauri, React e TypeScript\n" +
      "• Implementei atalhos globais, múltiplos timers, repetições, presets Pomodoro e notificações\n" +
      "• Adicionei customização de posição, monitor, cores, ícones e modo compacto para uso em jogos ou trabalho",
    descriptionEn:
      "• Built a Windows overlay timer/stopwatch using Tauri, React and TypeScript\n" +
      "• Implemented global shortcuts, multiple timers, repeats, Pomodoro presets and notifications\n" +
      "• Added customization for position, monitor, colors, icons and compact mode for games or work",
    techStack: ["Tauri", "React", "TypeScript", "Rust"],
    highlight: "Timer overlay desktop com atalhos globais, presets e notificações",
    highlightEn: "Desktop overlay timer with global shortcuts, presets and notifications",
    repoUrl: "https://github.com/LucasHenriqueDiniz/simple-overlay-timer",
    storeUrl: "https://github.com/LucasHenriqueDiniz/simple-overlay-timer/releases/tag/v0.1.3",
    status: "completed",
    category: "software",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Aplicativo desktop",
    typeEn: "Desktop application",
    year: "2025",
    featured: false,
    priority: 9,
    image: "/projects/simple-overlay-timer.webp",
    images: ["/projects/simple-overlay-timer.webp", "/projects/simple-overlay-timer-2.webp"],
  },
  {
    id: "simple-extension-boilerplate",
    name: "Simple Extension Boilerplate",
    description:
      "• Construí um boilerplate reutilizável para extensões Chrome com Manifest V3\n" +
      "• Estruturei popup, options, background, content scripts, i18n, changelog e registry de features\n" +
      "• Adicionei CLI de scaffolding para gerar novas extensões rapidamente a partir do template",
    descriptionEn:
      "• Built a reusable Chrome extension boilerplate with Manifest V3\n" +
      "• Structured popup, options, background, content scripts, i18n, changelog and feature registry\n" +
      "• Added a scaffolding CLI to quickly generate new extensions from the template",
    techStack: ["Manifest V3", "Vite", "React", "TypeScript", "Tailwind"],
    highlight: "Boilerplate Manifest V3 para criar extensões Chrome com menos repetição",
    highlightEn: "Manifest V3 boilerplate for building Chrome extensions with less repetition",
    repoUrl: "https://github.com/LucasHenriqueDiniz/simple-extension-boilerplate",
    status: "completed",
    category: "extension",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Template / developer tooling",
    typeEn: "Template / developer tooling",
    year: "2026",
    priority: 11,
    image: "/projects/simple-extension-boilerplate.webp",
  },
  {
    id: "resgate-rs",
    name: "Resgate RS",
    description:
      "• Construí uma plataforma para cadastro e busca de pessoas desaparecidas durante a tragédia no RS\n" +
      "• Implementei fluxo de registro, consulta e atualização usando Next.js e Supabase\n" +
      "• Disponibilizei o projeto como iniciativa open-source para resposta comunitária emergencial",
    descriptionEn:
      "• Built a platform for registering and searching missing people during the RS tragedy\n" +
      "• Implemented registration, lookup and update flows using Next.js and Supabase\n" +
      "• Open-sourced the project as a community emergency response initiative",
    techStack: ["Next.js", "TypeScript", "Supabase"],
    highlight: "Plataforma de cadastro e busca de desaparecidos criada para resposta emergencial no RS",
    highlightEn: "Missing people registration and search platform built for RS emergency response",
    url: "https://resgate-rs.vercel.app",
    repoUrl: "https://github.com/BotsChannel/resgate-rs",
    featured: true,
    status: "completed",
    category: "website",
    role: "Desenvolvedor fullstack",
    roleEn: "Fullstack developer",
    type: "Plataforma emergencial",
    typeEn: "Emergency response platform",
    year: "2024",
    priority: 12,
    image: "/projects/resgate-rs.webp",
    images: ["/projects/resgate-rs.webp", "/projects/resgate-rs-2.webp"],
  },
  {
    id: "quizhub",
    name: "QuizHub",
    description:
      "• Construí uma plataforma de questões com ranking, editor colaborativo e organização por concursos\n" +
      "• Modelei dados relacionais para questões, alternativas, provas, matérias e histórico de respostas\n" +
      "• Implementei pipeline de ingestão com apoio de LLM para transformar conteúdo bruto em dados estruturados",
    descriptionEn:
      "• Built a question platform with ranking, collaborative editor and exam-based organization\n" +
      "• Modeled relational data for questions, options, exams, subjects and answer history\n" +
      "• Implemented an ingestion pipeline with LLM assistance to turn raw content into structured data",
    techStack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "LLM Integration"],
    highlight: "Plataforma de questões com ranking e ingestão assistida por LLM",
    highlightEn: "Question platform with ranking and LLM-assisted ingestion",
    url: "https://quizhub.com.br/",
    repoUrl: "https://github.com/LucasHenriqueDiniz/quizhub",
    featured: true,
    status: "workInProgress",
    category: "website",
    role: "Desenvolvedor fullstack solo",
    roleEn: "Solo fullstack developer",
    type: "EdTech / banco de questões",
    typeEn: "EdTech / question bank",
    year: "2025-2026",
    priority: 2,
    image: "/projects/quizhub-thumbnail.webp",
    images: [
      "/projects/quizhub-thumbnail.webp",
      "/projects/quizhub.webp",
      "/projects/quizhub-2.webp",
      "/projects/quizhub-3.webp",
    ],
  },
  {
    id: "comunica-mulher",
    name: "ComunicaMulher",
    description:
      "• Construí um sistema de denúncias com fluxo de triagem, moderação e dashboard administrativo\n" +
      "• Implementei validação, sanitização de dados, filtros e visualização de registros\n" +
      "• Modelei Supabase RLS e PostgreSQL para separar permissões públicas e administrativas",
    descriptionEn:
      "• Built a complaint system with intake, moderation and admin dashboard workflow\n" +
      "• Implemented validation, data sanitization, filters and record visualization\n" +
      "• Modeled Supabase RLS and PostgreSQL to separate public and admin permissions",
    techStack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL"],
    highlight: "Sistema de denúncias com moderação, filtros e dashboard administrativo",
    highlightEn: "Complaint management system with moderation, filters and admin dashboard",
    url: "https://reclame-mulher.vercel.app/",
    repoUrl: "https://github.com/LucasHenriqueDiniz/reclame-mulher",
    status: "workInProgress",
    category: "website",
    role: "Desenvolvedor fullstack",
    roleEn: "Fullstack developer",
    type: "Sistema de gestão",
    typeEn: "Management system",
    year: "2025",
    priority: 14,
    image: "/projects/comunicamulher.webp",
    images: [
      "/projects/comunicamulher.webp",
      "/projects/comunica-mulher-2.webp",
      "/projects/comunica-mulher-3.webp",
    ],
  },
  {
    id: "itemmarketcap",
    name: "ItemMarketCap",
    description:
      "• Construí uma plataforma de análise para mercado de itens Steam com múltiplas integrações\n" +
      "• Implementei coleta, normalização e agregação de dados de preços\n" +
      "• Adicionei cache com Redis para métricas agregadas e consultas recorrentes",
    descriptionEn:
      "• Built an analytics platform for Steam item markets with multiple integrations\n" +
      "• Implemented price data collection, normalization and aggregation\n" +
      "• Added Redis caching for aggregated metrics and repeated queries",
    techStack: ["Next.js", "TypeScript", "API Integration", "Redis", "Data Processing"],
    highlight: "Analytics de mercado Steam com coleta de dados, normalização e cache Redis",
    highlightEn: "Steam market analytics with data collection, normalization and Redis caching",
    url: "https://item-marketcap.vercel.app/",
    repoUrl: "https://github.com/LucasHenriqueDiniz/item-marketcap",
    featured: true,
    status: "workInProgress",
    category: "website",
    role: "Desenvolvedor fullstack solo",
    roleEn: "Solo fullstack developer",
    type: "Analytics / mercado digital",
    typeEn: "Analytics / digital market",
    year: "2025",
    priority: 15,
    image: "/projects/itemmarketcap.webp",
    images: [
      "/projects/itemmarketcap.webp",
      "/projects/item-market-cap-2.webp",
      "/projects/item-market-cap-3.webp",
    ],
  },
  {
    id: "botschannel",
    name: "BotsChannel",
    description:
      "• Construí uma base SaaS serverless para automação de chatbots multi-canal\n" +
      "• Modelei arquitetura com AWS Lambda, processamento assíncrono e webhooks customizados\n" +
      "• Integrei APIs de mensageria para fluxos em WhatsApp, Telegram e Instagram",
    descriptionEn:
      "• Built a serverless SaaS base for multi-channel chatbot automation\n" +
      "• Designed architecture with AWS Lambda, async processing and custom webhooks\n" +
      "• Integrated messaging APIs for WhatsApp, Telegram and Instagram workflows",
    techStack: ["Node.js", "TypeScript", "AWS Lambda", "PostgreSQL", "API Integration"],
    highlight: "SaaS serverless para automação de chatbots multi-canal",
    highlightEn: "Serverless SaaS for multi-channel chatbot automation",
    url: "https://platform.botschannel.com/en",
    repoUrl: "https://github.com/BotsChannel",
    status: "discontinued",
    category: "software",
    role: "Desenvolvedor fullstack",
    roleEn: "Fullstack developer",
    type: "SaaS / automação",
    typeEn: "SaaS / automation",
    year: "2024",
    priority: 16,
    image: "/projects/bots-channel.webp",
    images: ["/projects/bots-channel.webp", "/projects/bots-channel-2.webp"],
  },
  {
    id: "autowabba",
    name: "AutoWabba",
    description:
      "• Construí um app desktop de automação para downloads em lote usando Playwright\n" +
      "• Implementei processamento paralelo, fila de tarefas e lógica de retry\n" +
      "• Modelei arquitetura Electron com IPC para comunicação entre UI e processo principal",
    descriptionEn:
      "• Built a desktop automation app for bulk downloads using Playwright\n" +
      "• Implemented parallel processing, task queue and retry logic\n" +
      "• Designed an Electron architecture with IPC between UI and main process",
    techStack: ["Electron", "Node.js", "Playwright", "Automation"],
    highlight: "Automação desktop para downloads em lote com Playwright e Electron",
    highlightEn: "Desktop automation for bulk downloads with Playwright and Electron",
    url: "https://github.com/LucasHenriqueDiniz/AutoWabba",
    repoUrl: "https://github.com/LucasHenriqueDiniz/AutoWabba",
    status: "completed",
    category: "software",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Automação desktop",
    typeEn: "Desktop automation",
    year: "2025",
    priority: 17,
    image: "/projects/autowabba.webp",
  },
  {
    id: "hypixel-daily-skip",
    name: "Hypixel Daily Skip",
    description:
      "• Publiquei uma extensão Manifest V3 para automatizar etapas repetitivas do reward diário do Hypixel\n" +
      "• Implementei auto-skip, hover automático de cartas e popup com toggles por automação\n" +
      "• Adicionei i18n, build de release, empacotamento ZIP e artefatos via GitHub Actions",
    descriptionEn:
      "• Published a Manifest V3 extension to automate repetitive steps in the Hypixel daily reward flow\n" +
      "• Implemented auto-skip, automatic reward card hover and a popup with per-automation toggles\n" +
      "• Added i18n, release builds, ZIP packaging and artifacts through GitHub Actions",
    techStack: ["TypeScript", "Manifest V3", "Browser Extension", "i18n"],
    highlight: "Extensão Chrome para simplificar o fluxo de daily reward do Hypixel",
    highlightEn: "Chrome extension that simplifies the Hypixel daily reward flow",
    repoUrl: "https://github.com/LucasHenriqueDiniz/hypixel-daily-skip",
    status: "completed",
    category: "extension",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Extensão de navegador",
    typeEn: "Browser extension",
    year: "2026",
    priority: 18,
    image: "/projects/hypixel-auto-join.webp",
  },
];

export const featuredProjects = projects
  .filter((project) => project.featured)
  .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
  .slice(0, 9);
