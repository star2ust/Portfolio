/**
 * Types + seed content for the site. Live content comes from Sanity (src/sanity/queries.ts)
 * once NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET are set — see src/sanity/env.ts. Until then,
 * and as the one-time payload for scripts/seed-sanity.mjs, the SEED_*_RU exports below carry the
 * real copy transcribed from the source Figma export (project/ui_kits/portfolio/*Screen.jsx) —
 * not placeholder, except where noted. SEED_*_EN are this site owner's English translations of
 * the same copy, used as the English fallback the same way — get*ByLocale() picks the right pair.
 */
import type { Locale } from "@/lib/i18n";

export interface Project {
  slug: string;
  title: string;
  /** kept as free text so the "\" separator convention survives, e.g. "touchdesigner \\ unity" */
  tech: string;
  year: string;
  image: string;
  gallery?: string[];
  index: string; // "01".."09" — the detail page's standing index mark
  role: string;
  body: string;
  tasks: string[];
  result: string;
  vimeoUrl?: string;
}

export interface Skill {
  name: string;
  level: number;
  body: string;
  /** links this node to a parent instead of the hub, mirrors SkillGraphNode */
  parent?: string;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface ContactRow {
  label: string;
  value: string;
  href: string;
  mark: boolean;
}

export interface SiteSettings {
  name: string;
  role: string;
  heroSpecs: SpecRow[];
  about: {
    title: string;
    lede: string;
    body1: string;
    body2: string;
    portrait: string;
    meta: SpecRow[];
  };
  work: { lede: string };
  skills: { emptyState: string };
  contact: { title: string; rows: ContactRow[] };
}

/** Pure helpers over an already-fetched array — shared by the live (Sanity) and seed paths so
 *  "previous/next" and "find by slug" logic only exists once. */
export function findProjectBySlug(projects: Project[], slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function findAdjacentProjects(projects: Project[], slug: string): { prev: Project; next: Project } {
  const i = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return { prev, next };
}

const SEED_DETAIL_PLACEHOLDER_RU = {
  role: "Роль: —",
  body: "Описание проекта. Заполняется через Sanity Studio (/studio).",
  tasks: ["Добавьте задачи через Sanity"],
  result: "Результат проекта. Заполняется через Sanity Studio.",
};

const SEED_DETAIL_PLACEHOLDER_EN = {
  role: "Role: —",
  body: "Project description. Fill in via Sanity Studio (/studio).",
  tasks: ["Add tasks via Sanity"],
  result: "Project result. Fill in via Sanity Studio.",
};

export const SEED_PROJECTS_RU: Project[] = [
  {
    slug: "veb-generative",
    title: "генеративная графика для стенда компании “ВЭБ.РФ” на ПМФ 2026",
    tech: "touchdesigner \\ unity",
    year: "2026",
    image: "/images/work/veb-generative.jpg",
    index: "01",
    ...SEED_DETAIL_PLACEHOLDER_RU,
  },
  {
    slug: "info-panels",
    title: "информационные панели для школ, музеев, мероприятий",
    tech: "unity",
    year: "2025",
    image: "/images/work/info-panels.png",
    index: "02",
    ...SEED_DETAIL_PLACEHOLDER_RU,
  },
  {
    slug: "field-of-flowers",
    title: "интерактивная инсталляция “поле цветов”",
    tech: "touchdesigner",
    year: "2024",
    image: "/images/work/field-of-flowers.png",
    index: "03",
    ...SEED_DETAIL_PLACEHOLDER_RU,
  },
  {
    slug: "labyrinth",
    title: "интерактивная инсталляция “лабиринт” в национальном центре “Россия”",
    tech: "touchdesigner \\ unity",
    year: "2025",
    image: "/images/work/labyrinth.png",
    index: "04",
    ...SEED_DETAIL_PLACEHOLDER_RU,
  },
  {
    slug: "kinect-projection",
    title: "проекционная инсталляция с кинектом",
    tech: "touchdesigner \\ kinect",
    year: "2025",
    image: "/images/work/kinect-projection.png",
    index: "05",
    ...SEED_DETAIL_PLACEHOLDER_RU,
  },
  {
    slug: "sanctum",
    title: "vr тренажер для обучения работе с рентгеновским оборудованием",
    tech: "unity vr",
    year: "2025",
    image: "/images/work/sanctum.jpg",
    index: "06",
    ...SEED_DETAIL_PLACEHOLDER_RU,
  },
  {
    slug: "bci-viz",
    title: "визуализация мозговой активности человека с помощью нейрокомпьютерного интерфейса",
    tech: "touchdesigner \\ bci",
    year: "2025",
    image: "/images/work/bci-viz.png",
    index: "07",
    ...SEED_DETAIL_PLACEHOLDER_RU,
  },
  {
    slug: "photogrammetry",
    title: "коллекция археологических артефактов сибирского федерального университета",
    tech: "фотограмметрия",
    year: "2024",
    image: "/images/work/photogrammetry.png",
    index: "08",
    ...SEED_DETAIL_PLACEHOLDER_RU,
  },
  {
    slug: "vr-upnl",
    title: "vr тренажер “УПНЛ” для подготовки студентов к работе в литейном цеху",
    tech: "unity vr",
    year: "2024",
    image: "/images/work/vr-upnl.png",
    index: "09", // grid position — the source's demo detail page used "01" regardless of which
    // card opened it (the pager was decorative there); a real per-project page needs its actual
    // position, not the leftover demo value
    role: "Роль: Unity-разработчик",
    body: "Тренажер виртуальной реальности для обучения студентов института цветных металлов и сотрудников предприятий, работе в цеху по резке и плавке металлов. Позволяет отработать базовые сценарии работы: резка металла, плавка, приготовление сплава, а так же научиться реагировать в непредвиденных ситуациях",
    tasks: [
      "Разработка обучающих механик",
      "Работа с UI элементами меню",
      "Настройка освещения",
      "Тестирование и оптимизация",
    ],
    result:
      "Проект был доведен до предрелизного состояния: релизованны обучающие сценарии, основное меню, настроено освещение, проведены работы по оптимизации.",
  },
];

// English translations of the same nine projects, by the site owner — slug/tech/year/image/index
// stay identical to the RU array (they're not language-dependent), only the prose differs.
export const SEED_PROJECTS_EN: Project[] = [
  {
    slug: "veb-generative",
    title: "generative graphics for the “VEB.RF” company stand at SPIEF 2026",
    tech: "touchdesigner \\ unity",
    year: "2026",
    image: "/images/work/veb-generative.jpg",
    index: "01",
    ...SEED_DETAIL_PLACEHOLDER_EN,
  },
  {
    slug: "info-panels",
    title: "information kiosks for schools, museums, and events",
    tech: "unity",
    year: "2025",
    image: "/images/work/info-panels.png",
    index: "02",
    ...SEED_DETAIL_PLACEHOLDER_EN,
  },
  {
    slug: "field-of-flowers",
    title: "“field of flowers” interactive installation",
    tech: "touchdesigner",
    year: "2024",
    image: "/images/work/field-of-flowers.png",
    index: "03",
    ...SEED_DETAIL_PLACEHOLDER_EN,
  },
  {
    slug: "labyrinth",
    title: "“labyrinth” interactive installation at the “Russia” national center",
    tech: "touchdesigner \\ unity",
    year: "2025",
    image: "/images/work/labyrinth.png",
    index: "04",
    ...SEED_DETAIL_PLACEHOLDER_EN,
  },
  {
    slug: "kinect-projection",
    title: "projection installation driven by Kinect",
    tech: "touchdesigner \\ kinect",
    year: "2025",
    image: "/images/work/kinect-projection.png",
    index: "05",
    ...SEED_DETAIL_PLACEHOLDER_EN,
  },
  {
    slug: "sanctum",
    title: "VR trainer for X-ray equipment operation training",
    tech: "unity vr",
    year: "2025",
    image: "/images/work/sanctum.jpg",
    index: "06",
    ...SEED_DETAIL_PLACEHOLDER_EN,
  },
  {
    slug: "bci-viz",
    title: "visualization of human brain activity via a brain-computer interface",
    tech: "touchdesigner \\ bci",
    year: "2025",
    image: "/images/work/bci-viz.png",
    index: "07",
    ...SEED_DETAIL_PLACEHOLDER_EN,
  },
  {
    slug: "photogrammetry",
    title: "archaeological artifact collection of the Siberian Federal University",
    tech: "photogrammetry",
    year: "2024",
    image: "/images/work/photogrammetry.png",
    index: "08",
    ...SEED_DETAIL_PLACEHOLDER_EN,
  },
  {
    slug: "vr-upnl",
    title: "“UPNL” VR trainer preparing students for work in a foundry",
    tech: "unity vr",
    year: "2024",
    image: "/images/work/vr-upnl.png",
    index: "09",
    role: "Role: Unity developer",
    body: "A virtual-reality trainer for students of the Institute of Non-Ferrous Metals and plant employees, teaching work in a metal-cutting and smelting shop. Lets trainees rehearse the core workflows — cutting metal, smelting, preparing an alloy — and learn to respond to unforeseen situations.",
    tasks: [
      "Designed the training mechanics",
      "Built the menu UI",
      "Set up the lighting",
      "Testing and optimization",
    ],
    result:
      "The project reached a pre-release state: the training scenarios and main menu shipped, lighting was tuned, and optimization work was completed.",
  },
];

export const SEED_SKILLS_RU: Skill[] = [
  {
    name: "TouchDesigner",
    level: 4,
    body: "Я Егор, создаю информационные приложения и интерактивные инсталляции \nс реалтайм-опытом. Работаю с Unity, TouchDesigner, микроконтроллерами на базе Arduino, 3D моделированием во Fusion 360 и печатью комплектующих на 3D принтере. Создаю real-time визуалы и эффекты",
  },
  {
    name: "Unity",
    level: 5,
    body: "Разработка VR-тренажёров, информационных приложений и игровых механик. Работа с UI, освещением, оптимизацией сцен и сборкой под шлемы и киоски.",
  },
  {
    name: "Arduino",
    level: 3,
    body: "Микроконтроллеры, датчики и камеры как вход для реалтайм-графики: движение, расстояние, касание, свет.",
  },
  {
    name: "Fusion360",
    level: 3,
    body: "3D моделирование корпусов и креплений под инсталляции с последующей печатью комплектующих на 3D принтере.",
  },
  {
    name: "AR\\VR",
    level: 4,
    body: "VR-тренажёры под шлемы: сценарии обучения, взаимодействие с объектами, тестирование и оптимизация сцен.",
    parent: "Unity",
  },
  {
    name: "Kinect",
    level: 3,
    body: "Захват движения и глубины как вход для реалтайм-графики: силуэты, трекинг тела, проекционные инсталляции.",
    parent: "TouchDesigner",
  },
  {
    name: "3D printing",
    level: 3,
    body: "Печать комплектующих и корпусов для инсталляций: подбор материала, допуски, постобработка.",
    parent: "Fusion360",
  },
  {
    name: "Photogrammetry",
    level: 3,
    body: "Оцифровка археологических артефактов: съёмка, сборка облака точек, ретопология и текстурирование.",
  },
  {
    name: "Figma",
    level: 3,
    body: "Проектирование интерфейсов приложений и информационных панелей перед сборкой в Unity.",
  },
  {
    name: "AfterEffects",
    level: 2,
    body: "Монтаж и постобработка роликов по проектам, титры и раскадровки анимаций.",
  },
  {
    name: "Blender",
    level: 2,
    body: "Моделирование и подготовка ассетов для сцен Unity и TouchDesigner.",
  },
];

// Skill *names* stay as-is in English too (they're tool names, already Latin script) — only the
// body copy is translated. level/parent are identical to the RU array by construction below.
export const SEED_SKILLS_EN: Skill[] = SEED_SKILLS_RU.map((skill) => {
  const body: Record<string, string> = {
    TouchDesigner:
      "I'm Egor — I build interactive installations and information kiosks with real-time graphics. I work with Unity, TouchDesigner, Arduino-based microcontrollers, 3D modeling in Fusion 360, and 3D-printing my own parts. I create real-time visuals and effects.",
    Unity:
      "Building VR trainers, information kiosks, and game mechanics. UI, lighting, scene optimization, and builds for headsets and kiosks.",
    Arduino: "Microcontrollers, sensors, and cameras as input for real-time graphics: motion, distance, touch, light.",
    Fusion360: "3D-modeling enclosures and mounts for installations, then 3D-printing the parts.",
    "AR\\VR": "VR trainers for headsets: training scenarios, object interaction, testing and scene optimization.",
    Kinect: "Motion and depth capture as input for real-time graphics: silhouettes, body tracking, projection installations.",
    "3D printing": "Printing parts and enclosures for installations: material choice, tolerances, post-processing.",
    Photogrammetry: "Digitizing archaeological artifacts: capture, point-cloud reconstruction, retopology, and texturing.",
    Figma: "Designing app and kiosk interfaces before building them out in Unity.",
    AfterEffects: "Editing and post-processing project reels, titles, and animation storyboards.",
    Blender: "Modeling and preparing assets for Unity and TouchDesigner scenes.",
  };
  return { ...skill, body: body[skill.name] ?? skill.body };
});

// All copy below is the author's real text, transcribed verbatim from the source Figma export
// (project/ui_kits/portfolio/{Hero,About,Contact}Screen.jsx) — not placeholder.
export const SEED_SITE_SETTINGS_RU: SiteSettings = {
  name: "Хабаров Егор",
  role: "Interactive Developer",
  heroSpecs: [
    { label: "СПЕЦИАЛИЗАЦИЯ", value: "INTERACTIVE DEVELOPMENT \\\nREALTIME GRAPHICS \\\nGAME DEVELOPMENT" },
    { label: "ИНСТРУМЕНТЫ", value: "UNITY \\ TOUCHDESIGNER \\\nARDUINO \\ 3D PRINTING" },
    { label: "INDEX", value: "PORTFOLIO 2026" },
  ],
  about: {
    title: "ОБО МНЕ",
    lede: "Interactive Developer, стирающий грань между цифровым и физическим миром с помощью технологий",
    body1:
      "Я Егор, создаю информационные приложения и интерактивные инсталляции с реалтайм-опытом. Работаю с Unity, TouchDesigner, микроконтроллерами на базе Arduino, 3D моделированием во Fusion 360 и печатью комплектующих на 3D принтере. Создаю real-time визуалы и эффекты",
    body2:
      "Степень бакалавра в сфере информатики по направлению: «Прикладная информатика в искусстве и интерактивных медиа»\n\nОпыт работы 3 года: 2 года в лабаратории цифровых гуманитарных исследований Сибирского федерального университета. 1 год в компании «ITEO» на позиции Unity-разработчика",
    portrait: "/images/portrait.jpg",
    meta: [
      { label: "ИМЯ", value: "ХАБАРОВ ЕГОР" },
      { label: "Y.O.", value: "22" },
      { label: "РОЛЬ", value: "INTERACTIVE DEVELOPER\nUNITY DEVELOPER\nTOUCHDESIGNER DEVELOPER" },
      { label: "КОНТАКТЫ", value: "tg: @Star2ust\nmail: egorhabarov835@gmail.com" },
    ],
  },
  contact: {
    title: "Связь.",
    rows: [
      { label: "", value: "egorhabarov835@gmail.com", href: "mailto:egorhabarov835@gmail.com", mark: false },
      { label: "tg:", value: "@Star2ust", href: "https://t.me/Star2ust", mark: true },
      { label: "VK:", value: "star2ust", href: "https://vk.com/star2ust", mark: true },
      { label: "inst:", value: "@Star2ust", href: "https://instagram.com/Star2ust", mark: true },
    ],
  },
  work: {
    lede: "Работы на стыке инженерии и художественного высказывания. VR‑тренажёры, информационные стенды, инсталляции с датчиками движения, цифровые модели археологических артефактов.",
  },
  skills: {
    // shown in the info panel before any node is selected (mobile kit's own placeholder copy)
    emptyState: "Коснитесь узла графа, чтобы раскрыть навык.",
  },
};

export const SEED_SITE_SETTINGS_EN: SiteSettings = {
  name: "Egor Khabarov",
  role: "Interactive Developer",
  heroSpecs: [
    { label: "SPECIALIZATION", value: "INTERACTIVE DEVELOPMENT \\\nREALTIME GRAPHICS \\\nGAME DEVELOPMENT" },
    { label: "TOOLS", value: "UNITY \\ TOUCHDESIGNER \\\nARDUINO \\ 3D PRINTING" },
    { label: "INDEX", value: "PORTFOLIO 2026" },
  ],
  about: {
    title: "ABOUT",
    lede: "Interactive Developer blurring the line between the digital and physical worlds through technology",
    body1:
      "I'm Egor — I build interactive installations and information kiosks with real-time graphics. I work with Unity, TouchDesigner, Arduino-based microcontrollers, 3D modeling in Fusion 360, and 3D-printing my own parts. I create real-time visuals and effects.",
    body2:
      "Bachelor's degree in computer science, specializing in “Applied Computer Science in Art and Interactive Media”\n\n3 years of experience: 2 years at the Digital Humanities Research Lab of the Siberian Federal University, 1 year at “ITEO” as a Unity developer.",
    portrait: "/images/portrait.jpg",
    meta: [
      { label: "NAME", value: "EGOR KHABAROV" },
      { label: "AGE", value: "22" },
      { label: "ROLE", value: "INTERACTIVE DEVELOPER\nUNITY DEVELOPER\nTOUCHDESIGNER DEVELOPER" },
      { label: "CONTACT", value: "tg: @Star2ust\nmail: egorhabarov835@gmail.com" },
    ],
  },
  contact: {
    title: "Contact.",
    rows: [
      { label: "", value: "egorhabarov835@gmail.com", href: "mailto:egorhabarov835@gmail.com", mark: false },
      { label: "tg:", value: "@Star2ust", href: "https://t.me/Star2ust", mark: true },
      { label: "VK:", value: "star2ust", href: "https://vk.com/star2ust", mark: true },
      { label: "inst:", value: "@Star2ust", href: "https://instagram.com/Star2ust", mark: true },
    ],
  },
  work: {
    lede: "Work at the intersection of engineering and artistic statement. VR trainers, information kiosks, motion-sensor installations, digital models of archaeological artifacts.",
  },
  skills: {
    emptyState: "Tap a node in the graph to reveal a skill.",
  },
};

/** Picks the RU or EN seed pair for a locale — the single place that maps Locale -> SEED_*. */
export function getSeedProjects(locale: Locale): Project[] {
  return locale === "en" ? SEED_PROJECTS_EN : SEED_PROJECTS_RU;
}
export function getSeedSkills(locale: Locale): Skill[] {
  return locale === "en" ? SEED_SKILLS_EN : SEED_SKILLS_RU;
}
export function getSeedSiteSettings(locale: Locale): SiteSettings {
  return locale === "en" ? SEED_SITE_SETTINGS_EN : SEED_SITE_SETTINGS_RU;
}
