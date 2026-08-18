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
    featured: true,
    status: "completed",
    category: "website",
    role: "Desenvolvedor fullstack solo",
    roleEn: "Solo fullstack developer",
    type: "Plataforma de conteúdo",
    typeEn: "Content platform",
    year: "2025-2026",
    priority: 1,
    image: "/projects/heartopia-hero.jpg",
    showInDonate: true,
    images: [
      "/projects/heartopia-hero.jpg",
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
    status: "completed",
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
    id: "dropcut",
    name: "DropCut",
    description:
      "• Desenvolvi um app desktop para compactar e cortar videos localmente no Windows com fluxo simples\n" +
      "• Integrei Tauri, Rust e FFmpeg para processar arquivos offline com presets prontos para Discord\n" +
      "• Adicionei recursos de exportacao, build de instalador e pipeline de release automatizado no GitHub Actions",
    descriptionEn:
      "• Built a desktop app to compress and trim videos locally on Windows with a simple workflow\n" +
      "• Integrated Tauri, Rust and FFmpeg for fully offline processing with Discord-ready presets\n" +
      "• Added export features, installer builds and an automated GitHub Actions release pipeline",
    techStack: ["Tauri", "Rust", "TypeScript", "React", "FFmpeg"],
    highlight: "App desktop offline para compactacao e corte de videos com FFmpeg",
    highlightEn: "Offline desktop app for video compression and trimming with FFmpeg",
    url: "https://dropcut.pages.dev",
    repoUrl: "https://github.com/LucasHenriqueDiniz/dropcut",
    featured: true,
    status: "workInProgress",
    category: "software",
    role: "Desenvolvedor fullstack solo",
    roleEn: "Solo fullstack developer",
    type: "Aplicativo desktop",
    typeEn: "Desktop application",
    year: "2026",
    priority: 2,
    image: "/projects/dropcut-video.webp",
    images: [
      "/projects/dropcut-video.webp",
      "/projects/dropcut-novideo.webp",
      "/projects/dropcut-landing.png",
      "/projects/dropcut-banner.png",
    ],
    showInDonate: true,
  },
  {
    id: "lucas-ui-vault",
    name: "Lucas UI Vault",
    description:
      "• Reuni em um acervo unico componentes que eu criei em projetos reais e experimentos paralelos\n" +
      "• Estruturei previews interativos, docs de props, snippets de uso e index navegavel por categoria\n" +
      "• Configurei pipeline de deploy separado para publicar a biblioteca sem impactar o portfolio principal",
    descriptionEn:
      "• Consolidated components I built across real projects and side experiments into a single archive\n" +
      "• Structured interactive previews, prop docs, usage snippets and a navigable category index\n" +
      "• Set up an isolated deployment pipeline so the library ships without impacting the main portfolio",
    techStack: ["React", "TypeScript", "Vite", "Framer Motion", "Cloudflare Pages"],
    highlight: "Acervo pessoal de componentes com previews ao vivo, documentacao e deploy isolado",
    highlightEn: "Personal component archive with live previews, docs and isolated deployment",
    url: "https://ui.lucashdo.com/",
    repoUrl: "https://github.com/LucasHenriqueDiniz/lucas-ui-database",
    featured: true,
    status: "workInProgress",
    category: "website",
    role: "Desenvolvedor frontend solo",
    roleEn: "Solo frontend developer",
    type: "Biblioteca de componentes",
    typeEn: "Component library",
    year: "2026",
    priority: 0,
    image: "/projects/lucas-ui-vault.webp",
    images: [
      "/projects/lucas-ui-vault.webp",
      "/projects/uivault-home.png",
      "/gallery/portfolio-character-component.png",
    ],
    showInDonate: false,
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
    url: "https://weebprofile-dashboard.pages.dev",
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
    image: "/projects/weebprofile-dashboard.jpg",
    images: ["/projects/weebprofile-dashboard.jpg", "/projects/weebprofile.webp"],
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
    image: "/projects/winxp-desktop.png",
    images: ["/projects/winxp-desktop.png", "/projects/windows_xp_online.webp"],
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
      "• Disponibilizei o projeto como iniciativa open-source para resposta comunitária emergencial\n" +
      "• Sem ambiente de produção ativo: a emergência passou e o deploy foi desligado — o código segue aberto no repositório",
    descriptionEn:
      "• Built a platform for registering and searching missing people during the RS tragedy\n" +
      "• Implemented registration, lookup and update flows using Next.js and Supabase\n" +
      "• Open-sourced the project as a community emergency response initiative\n" +
      "• No live production environment: the emergency passed and the deployment was shut down — the code remains open in the repository",
    techStack: ["Next.js", "TypeScript", "Supabase"],
    highlight: "Plataforma emergencial de desaparecidos no RS — sem produção ativa, código aberto no repositório",
    highlightEn: "RS missing-people emergency platform — no live production, source open in the repository",
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
    image: "/projects/comunicamulher-hero.jpg",
    images: [
      "/projects/comunicamulher-hero.jpg",
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
    featured: true,
    status: "workInProgress",
    category: "website",
    role: "Desenvolvedor fullstack solo",
    roleEn: "Solo fullstack developer",
    type: "Analytics / mercado digital",
    typeEn: "Analytics / digital market",
    year: "2025",
    priority: 15,
    image: "/projects/itemmarketcap-hero.png",
    images: [
      "/projects/itemmarketcap-hero.png",
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
    url: "https://botschannel-showcase.pages.dev/",
    repoUrl: "https://github.com/LucasHenriqueDiniz/botschannel",
    status: "discontinued",
    category: "software",
    role: "Desenvolvedor fullstack",
    roleEn: "Fullstack developer",
    type: "SaaS / automação",
    typeEn: "SaaS / automation",
    year: "2024",
    priority: 16,
    image: "/projects/botschannel-hero.png",
    images: [
      "/projects/botschannel-hero.png",
      "/projects/bots-channel.webp",
      "/projects/bots-channel-2.webp",
    ],
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
  {
    id: "funsona",
    name: "FunSona",
    description:
      "• Construí uma plataforma de quizzes SEO-first para criar, jogar e compartilhar quizzes de trivia e personalidade\n" +
      "• Estruturei monorepo com Astro + React no frontend e API Hono em Cloudflare Workers, com auth via Clerk\n" +
      "• Implementei gamificação (XP, streaks, leaderboards, achievements), busca full-text em Postgres e premium via Stripe",
    descriptionEn:
      "• Built an SEO-first quiz platform for creating, playing and sharing trivia and personality quizzes\n" +
      "• Structured a monorepo with Astro + React frontend and a Hono API on Cloudflare Workers, with Clerk auth\n" +
      "• Implemented gamification (XP, streaks, leaderboards, achievements), Postgres full-text search and Stripe premium",
    techStack: ["Astro", "React", "TypeScript", "Hono", "Cloudflare Workers", "Supabase", "Stripe"],
    highlight: "Plataforma de quizzes SEO-first com gamificação e monetização — sucessora do QuizHub",
    highlightEn: "SEO-first quiz platform with gamification and monetization — successor to QuizHub",
    url: "https://funsona.com/",
    repoUrl: "https://github.com/LucasHenriqueDiniz/funsona",
    featured: true,
    status: "workInProgress",
    category: "website",
    role: "Desenvolvedor fullstack solo",
    roleEn: "Solo fullstack developer",
    type: "Plataforma de quizzes",
    typeEn: "Quiz platform",
    year: "2025-2026",
    priority: 2,
    image: "/projects/funsona.png",
    images: [
      "/projects/funsona.png",
      "/projects/funsona-explore.png",
      "/projects/funsona-quiz.jpg",
      "/projects/funsona-leaderboard.png",
    ],
  },
  {
    id: "koto-by-pingo",
    name: "Koto By Pingo",
    description:
      "• Desenvolvi uma app interativa de aprendizado de japonês com 7 modos de treinamento (Hiragana, Katakana, Kanji, vocabulário)\n" +
      "• Implementei simulados JLPT, rastreamento de progresso e interface responsiva com Framer Motion\n" +
      "• Otimizei performance com Vite, TypeScript strict e deploy em Cloudflare Pages",
    descriptionEn:
      "• Built an interactive Japanese learning app with 7 training modes (Hiragana, Katakana, Kanji, vocabulary)\n" +
      "• Implemented JLPT mock exams, progress tracking and responsive UI with Framer Motion\n" +
      "• Optimized performance with Vite, strict TypeScript and Cloudflare Pages deployment",
    techStack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion"],
    highlight: "Plataforma de aprendizado de japonês com múltiplos modos de treinamento",
    highlightEn: "Japanese learning platform with multiple training modes",
    url: "https://koto-by-pingo.pages.dev/kana",
    repoUrl: "https://github.com/LucasHenriqueDiniz/koto-by-pingo",
    featured: true,
    status: "completed",
    category: "website",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "App educacional",
    typeEn: "Educational app",
    year: "2025-2026",
    priority: 5,
    image: "/projects/koto-by-pingo.png",
    images: [
      "/projects/koto-by-pingo.png",
      "/projects/koto-home.png",
      "/projects/koto-vocab.png",
      "/projects/koto-simulados.png",
      "/projects/koto-escuta.png",
    ],
  },
  {
    id: "tubetrace",
    name: "TubeTrace",
    description:
      "• Criei um analisador de histórico do YouTube com processamento 100% local no navegador\n" +
      "• Implementei 8 arcétipos de personalidade de visualização, mapas de calor (horário/diário/mensal/anual) e detecção de binges\n" +
      "• Adicionei suporte multi-idiomas (EN, PT, ES, FR, DE, IT), exportação de arquivos e modo demo com Recharts",
    descriptionEn:
      "• Built a YouTube watch history analyzer with 100% local browser-side processing\n" +
      "• Implemented 8 viewing personality archetypes, heatmaps (hourly/daily/monthly/yearly) and binge detection\n" +
      "• Added multilingual support (EN, PT, ES, FR, DE, IT), file export and demo mode with Recharts",
    techStack: ["React", "TypeScript", "Vite", "Recharts", "Framer Motion"],
    highlight: "Analisador de histórico do YouTube com processamento totalmente local",
    highlightEn: "Privacy-focused YouTube history analyzer with local processing",
    url: "https://tubetrace.pages.dev/",
    repoUrl: "https://github.com/LucasHenriqueDiniz/tubetrace",
    featured: true,
    status: "completed",
    category: "website",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Ferramenta de análise",
    typeEn: "Analytics tool",
    year: "2025-2026",
    priority: 6,
    image: "/projects/tubetrace.png",
    images: ["/projects/tubetrace.png", "/projects/tubetrace2.png", "/projects/tubetrace3.png"],
  },
  {
    id: "small-web-apps",
    name: "Small Web Apps",
    description:
      "• Compilei uma coleção de 136+ ferramentas gratuitas de navegador (JSON formatter, JWT decoder, ferramentas PDF, processamento de imagens, utilidades do YouTube)\n" +
      "• Implementei arquitetura com Astro + React, processamento 100% local e interface intuitiva\n" +
      "• Otimizei para performance, acessibilidade e SEO com Tailwind CSS e deploy em Cloudflare Pages",
    descriptionEn:
      "• Compiled a collection of 136+ free browser-based tools (JSON formatter, JWT decoder, PDF tools, image processing, YouTube utilities)\n" +
      "• Implemented Astro + React architecture with 100% local processing and intuitive UI\n" +
      "• Optimized for performance, accessibility and SEO with Tailwind CSS and Cloudflare Pages deployment",
    techStack: ["Astro", "React", "TypeScript", "Tailwind CSS"],
    highlight: "Coleção de ferramentas web gratuitas sem contas, uploads ou servidores",
    highlightEn: "Free web tools collection - no accounts, uploads, or servers",
    url: "https://smallwebapps.com/",
    repoUrl: "https://github.com/LucasHenriqueDiniz/smallwebapps",
    featured: true,
    status: "completed",
    category: "website",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Coleção de ferramentas",
    typeEn: "Tools collection",
    year: "2025-2026",
    priority: 7,
    image: "/projects/smallwebapps-hero.png",
    images: [
      "/projects/smallwebapps-hero.png",
      "/projects/smallwebapps-apps.png",
      "/projects/smallwebapps.png",
      "/projects/smallwebapps2.png",
      "/projects/smallwebapps3.png",
    ],
  },
  {
    id: "calculebrasil",
    name: "Calcule Brasil",
    description:
      "• Desenvolvi um hub de 12 calculadoras brasileiras (custos de carro, vida solo, eletricidade, IRPF, INSS autonomo, CLT vs PJ)\n" +
      "• Estruturei 15 artigos de blog, 4 comparativos lado-a-lado, 6 páginas institucionais com otimização SEO completa\n" +
      "• Implementei com React, TanStack Start e deploy em Cloudflare Workers com performance de edge computing",
    descriptionEn:
      "• Developed a hub of 12 Brazilian calculators (car costs, solo living, electricity, IRPF, autonomous INSS, CLT vs PJ)\n" +
      "• Structured 15 blog articles, 4 side-by-side comparisons, 6 institutional pages with complete SEO optimization\n" +
      "• Implemented with React, TanStack Start and Cloudflare Workers deployment with edge computing performance",
    techStack: ["React", "TypeScript", "TanStack Start", "Cloudflare Workers"],
    highlight: "12 calculadoras interativas para decisões financeiras no Brasil",
    highlightEn: "12 interactive calculators for financial decisions in Brazil",
    url: "https://calculebrasil.com/",
    repoUrl: "https://github.com/LucasHenriqueDiniz/calculadoras-brasil",
    featured: true,
    status: "completed",
    category: "website",
    role: "Desenvolvedor fullstack",
    roleEn: "Fullstack developer",
    type: "Calculadora financeira",
    typeEn: "Financial calculator",
    year: "2025-2026",
    priority: 8,
    image: "/projects/calculebrasil-hero.png",
    images: [
      "/projects/calculebrasil-hero.png",
      "/projects/calculebrasil.png",
      "/projects/calculebrasil-2.png",
    ],
  },
  {
    id: "adsense-site-auditor",
    name: "AdSense Site Auditor",
    description:
      "• Criei um Skill do Claude Code que avalia sites contra critérios de elegibilidade do Google AdSense\n" +
      "• Implementei 73 verificações de requisitos da documentação oficial, crawling de sites com controle de profundidade e validação SEO técnica\n" +
      "• Adicionei 6 modos de auditoria (pré-aplicação, pós-rejeição, verificação, análise de repo, geração de tarefas, health checks)",
    descriptionEn:
      "• Created a Claude Code skill that evaluates websites against Google AdSense eligibility criteria\n" +
      "• Implemented 73 requirement checks from official documentation, site crawling with depth control and technical SEO validation\n" +
      "• Added 6 audit modes (pre-application, post-rejection, verification, repo analysis, task generation, health checks)",
    techStack: ["Python", "Claude Code", "Web Scraping"],
    highlight: "Auditor de elegibilidade do AdSense alimentado por Claude",
    highlightEn: "Claude-powered AdSense eligibility auditor",
    repoUrl: "https://github.com/LucasHenriqueDiniz/adsense-site-auditor",
    status: "completed",
    category: "software",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Ferramenta de auditoria",
    typeEn: "Auditing tool",
    year: "2025-2026",
    priority: 10,
    image: "/projects/adsense-site-auditor.png",
  },
  {
    id: "arca",
    name: "Arca",
    description:
      "• Plataforma web moderna construída com foco em experiência do usuário e performance\n" +
      "• Implementei com React, TypeScript e deploy em Cloudflare Pages\n" +
      "• Arquitetura escalável e componentes reutilizáveis",
    descriptionEn:
      "• Modern web platform built with focus on user experience and performance\n" +
      "• Implemented with React, TypeScript and Cloudflare Pages deployment\n" +
      "• Scalable architecture and reusable components",
    techStack: ["React", "TypeScript", "Cloudflare Pages"],
    highlight: "Aplicação web moderna com arquitetura escalável",
    highlightEn: "Modern web application with scalable architecture",
    url: "https://arca-web.pages.dev/",
    status: "completed",
    category: "website",
    role: "Desenvolvedor fullstack",
    roleEn: "Fullstack developer",
    type: "Aplicação web",
    typeEn: "Web application",
    year: "2025",
    priority: 11,
    image: "/projects/arca.png",
    images: ["/projects/arca.png", "/projects/arca-2.png", "/projects/arca-3.png"],
  },
  {
    id: "argo-studios",
    name: "Argo Studios",
    description:
      "• Plataforma criativa para estúdios e artistas colaborarem em projetos\n" +
      "• Implementei interface intuitiva com ferramentas de colaboração em tempo real\n" +
      "• Estruturei arquitetura escalável para suportar múltiplos usuários e projetos simultâneos",
    descriptionEn:
      "• Creative platform for studios and artists to collaborate on projects\n" +
      "• Implemented intuitive interface with real-time collaboration tools\n" +
      "• Structured scalable architecture to support multiple concurrent users and projects",
    techStack: ["React", "TypeScript", "WebSockets", "Cloudflare"],
    highlight: "Plataforma colaborativa para criadores e estúdios",
    highlightEn: "Collaborative platform for creators and studios",
    status: "completed",
    category: "website",
    role: "Desenvolvedor fullstack",
    roleEn: "Fullstack developer",
    type: "Plataforma colaborativa",
    typeEn: "Collaborative platform",
    year: "2025-2026",
    priority: 9,
    image: "/projects/argo-studios.png",
    images: ["/projects/argo-studios.png", "/projects/argo-studios-2.png", "/projects/argo-studios-3.png"],
  },
  {
    id: "gocronometer-mcp",
    name: "Cronometer MCP",
    description:
      "• Construí um servidor MCP (Model Context Protocol) local para automação do Cronometer e integração com assistentes de IA\n" +
      "• Implementei rastreamento de nutrição, cálculo de macros, registro de peso e dados de exercícios\n" +
      "• Estruturei com Go e protocolo stdio MCP para comunicação com Claude e outros assistentes",
    descriptionEn:
      "• Built a local MCP (Model Context Protocol) server for Cronometer automation and AI assistant integration\n" +
      "• Implemented nutrition tracking, macro calculation, weight logging and exercise data management\n" +
      "• Structured with Go and stdio MCP protocol for communication with Claude and other AI assistants",
    techStack: ["Go", "MCP", "CLI"],
    highlight: "Servidor MCP para automação de nutrição com assistentes de IA",
    highlightEn: "MCP server for nutrition automation with AI assistants",
    repoUrl: "https://github.com/LucasHenriqueDiniz/gocronometer-mcp",
    status: "completed",
    category: "software",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Ferramenta de CLI",
    typeEn: "CLI Tool",
    year: "2025-2026",
    priority: 12,
    image: "/projects/gocronometer-mcp.png",
  },
  {
    id: "jikan-edge",
    name: "Jikan Edge",
    description:
      "• Construí uma API REST de anime/mangá com paridade funcional com o Jikan, rodando inteira em Cloudflare Workers\n" +
      "• Implementei 97 rotas cobrindo 96 dos 100 endpoints do Jikan v4, com cache em D1, stale fallback e rate limiting por IP\n" +
      "• Escrevi testes de contrato por rota, benchmarks de parser e setup de self-hosting com um comando",
    descriptionEn:
      "• Built an anime/manga REST API with functional parity with Jikan, running entirely on Cloudflare Workers\n" +
      "• Implemented 97 routes covering 96 of Jikan v4's 100 endpoints, with D1 caching, stale fallback and per-IP rate limiting\n" +
      "• Wrote per-route contract tests, parser benchmarks and one-command self-hosting setup",
    techStack: ["Cloudflare Workers", "TypeScript", "D1", "REST API", "Web Scraping"],
    highlight: "API de dados do MyAnimeList servida na edge com cache D1 — alimenta este próprio portfólio",
    highlightEn: "MyAnimeList data API served at the edge with D1 caching — powers this very portfolio",
    url: "https://jikan-edge.lucas-hdo.workers.dev",
    repoUrl: "https://github.com/LucasHenriqueDiniz/jikan-edge",
    featured: true,
    status: "completed",
    category: "software",
    role: "Desenvolvedor backend solo",
    roleEn: "Solo backend developer",
    type: "API pública / edge computing",
    typeEn: "Public API / edge computing",
    year: "2026",
    priority: 3,
    image: "/projects/jikan-edge.png",
    images: ["/projects/jikan-edge.png", "/projects/jikan-edge-docs.png"],
  },
  {
    id: "word-genie",
    name: "Word Genie",
    description:
      "• Construí um solver de palavras em tempo real para Gartic Phone e Guess The Build com resposta em milissegundos\n" +
      "• Curei dicionários com 26 mil+ palavras em 5 idiomas (PT, EN, ES, FR, IT) com i18n completo e hreflang\n" +
      "• Implementei com Astro + React islands para JS mínimo, Lighthouse 95+ e Core Web Vitals verdes",
    descriptionEn:
      "• Built a real-time word solver for Gartic Phone and Guess The Build with millisecond responses\n" +
      "• Curated dictionaries with 26k+ words across 5 languages (PT, EN, ES, FR, IT) with full i18n and hreflang\n" +
      "• Implemented with Astro + React islands for minimal JS, Lighthouse 95+ and green Core Web Vitals",
    techStack: ["Astro", "React", "TypeScript", "Tailwind CSS", "Cloudflare Pages"],
    highlight: "Solver de palavras multilíngue com pattern matching instantâneo no navegador",
    highlightEn: "Multilingual word solver with instant in-browser pattern matching",
    url: "https://word-genie.pages.dev",
    repoUrl: "https://github.com/LucasHenriqueDiniz/word-genie",
    status: "completed",
    category: "website",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Ferramenta para jogos",
    typeEn: "Gaming tool",
    year: "2026",
    priority: 10,
    image: "/projects/word-genie-hero.png",
    images: [
      "/projects/word-genie-hero.png",
      "/projects/word-genie-gartic.png",
      "/projects/word-genie-gtb.png",
      "/projects/word-genie.png",
    ],
  },
  {
    id: "sounddeck",
    name: "SoundDeck",
    description:
      "• Estou construindo um gerenciador de esquemas de som para Windows 10/11 com Tauri e React\n" +
      "• Implementei catálogo de esquemas temáticos, preview de sons e aplicação direta no registro do sistema\n" +
      "• Estruturei pipeline de build do catálogo e empacotamento de esquemas em ZIP",
    descriptionEn:
      "• Building a sound scheme manager for Windows 10/11 with Tauri and React\n" +
      "• Implemented a themed scheme catalog, sound previews and direct application to the system registry\n" +
      "• Structured a catalog build pipeline and ZIP scheme packaging",
    techStack: ["Tauri", "Rust", "React", "TypeScript"],
    highlight: "Gerenciador de esquemas de som do Windows com catálogo temático",
    highlightEn: "Windows sound scheme manager with a themed catalog",
    repoUrl: "https://github.com/LucasHenriqueDiniz/sounddeck",
    status: "workInProgress",
    category: "software",
    role: "Desenvolvedor solo",
    roleEn: "Solo developer",
    type: "Aplicativo desktop",
    typeEn: "Desktop application",
    year: "2026",
    priority: 16,
  },
  {
    id: "bento-portfolio",
    name: "Bento Portfolio",
    description:
      "• Construí este portfólio em estilo bento com React, Vite e Cloudflare Pages Functions\n" +
      "• Integrei GitHub, Last.fm, MyAnimeList (via Jikan Edge), Steam e Lyfta server-side com cache em KV\n" +
      "• Adicionei card de telemetria das minhas máquinas alimentado por D1, currículo em PDF e i18n PT/EN",
    descriptionEn:
      "• Built this bento-style portfolio with React, Vite and Cloudflare Pages Functions\n" +
      "• Integrated GitHub, Last.fm, MyAnimeList (via Jikan Edge), Steam and Lyfta server-side with KV caching\n" +
      "• Added a machine telemetry card fed by D1, PDF resume generation and PT/EN i18n",
    techStack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Cloudflare Pages Functions"],
    highlight: "Este site: cards bento com integrações ao vivo e backend serverless",
    highlightEn: "This site: bento cards with live integrations and a serverless backend",
    url: "https://lucashdo.com/",
    repoUrl: "https://github.com/LucasHenriqueDiniz/bento-portifolio",
    status: "completed",
    category: "website",
    role: "Desenvolvedor fullstack solo",
    roleEn: "Solo fullstack developer",
    type: "Portfólio / integrações",
    typeEn: "Portfolio / integrations",
    year: "2025-2026",
    priority: 14,
    image: "/projects/bento-portfolio.jpg",
  },
];

export const featuredProjects = projects
  .filter((project) => project.featured)
  .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
  .slice(0, 9);
