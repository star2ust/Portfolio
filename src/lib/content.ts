/**
 * Phase 2 placeholder content — mirrors project/ui_kits/portfolio/data.js, the one real
 * content the design bundle shipped. Grid captions/tech/year/images below are the author's
 * actual Figma copy. The detail fields (role/body/tasks/result) only exist for real on ONE
 * project in the source (the prev/next pager was "decorative" there — README's words) — that
 * text is attached below to project 9 ("УПНЛ"), whose subject (continuous-casting / литейный
 * цех) matches it. The other 8 projects get an explicit placeholder body instead of invented
 * biography; Phase 4 replaces this whole module with a `next-sanity` fetch of the same shape.
 */

export interface Project {
  id: number;
  slug: string;
  title: string;
  /** kept as free text so the "\" separator convention survives, e.g. "touchdesigner \\ unity" */
  tech: string;
  year: string;
  image: string;
  index: string; // "01".."09" — the detail page's standing index mark
  role: string;
  body: string;
  tasks: string[];
  result: string;
  vimeoUrl?: string;
}

const PLACEHOLDER_DETAIL = {
  role: "Роль: —",
  body: "Описание проекта. Заполняется через Sanity Studio (/studio) — Phase 4.",
  tasks: ["Добавьте задачи через Sanity"],
  result: "Результат проекта. Заполняется через Sanity Studio — Phase 4.",
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "veb-generative",
    title: "генеративная графика для стенда компании “ВЭБ.РФ” на ПМФ 2026",
    tech: "touchdesigner \\ unity",
    year: "2026",
    image: "/images/work/veb-generative.jpg",
    index: "01",
    ...PLACEHOLDER_DETAIL,
  },
  {
    id: 2,
    slug: "info-panels",
    title: "информационные панели для школ, музеев, мероприятий",
    tech: "unity",
    year: "2025",
    image: "/images/work/info-panels.png",
    index: "02",
    ...PLACEHOLDER_DETAIL,
  },
  {
    id: 3,
    slug: "field-of-flowers",
    title: "интерактивная инсталляция “поле цветов”",
    tech: "touchdesigner",
    year: "2024",
    image: "/images/work/field-of-flowers.png",
    index: "03",
    ...PLACEHOLDER_DETAIL,
  },
  {
    id: 4,
    slug: "labyrinth",
    title: "интерактивная инсталляция “лабиринт” в национальном центре “Россия”",
    tech: "touchdesigner \\ unity",
    year: "2025",
    image: "/images/work/labyrinth.png",
    index: "04",
    ...PLACEHOLDER_DETAIL,
  },
  {
    id: 5,
    slug: "kinect-projection",
    title: "проекционная инсталляция с кинектом",
    tech: "touchdesigner \\ kinect",
    year: "2025",
    image: "/images/work/kinect-projection.png",
    index: "05",
    ...PLACEHOLDER_DETAIL,
  },
  {
    id: 6,
    slug: "sanctum",
    title: "vr тренажер для обучения работе с рентгеновским оборудованием",
    tech: "unity vr",
    year: "2025",
    image: "/images/work/sanctum.jpg",
    index: "06",
    ...PLACEHOLDER_DETAIL,
  },
  {
    id: 7,
    slug: "bci-viz",
    title: "визуализация мозговой активности человека с помощью нейрокомпьютерного интерфейса",
    tech: "touchdesigner \\ bci",
    year: "2025",
    image: "/images/work/bci-viz.png",
    index: "07",
    ...PLACEHOLDER_DETAIL,
  },
  {
    id: 8,
    slug: "photogrammetry",
    title: "коллекция археологических артефактов сибирского федерального университета",
    tech: "фотограмметрия",
    year: "2024",
    image: "/images/work/photogrammetry.png",
    index: "08",
    ...PLACEHOLDER_DETAIL,
  },
  {
    id: 9,
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

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): { prev: Project; next: Project } {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  return { prev, next };
}

export interface Skill {
  name: string;
  level: number;
  body: string;
  /** links this node to a parent instead of the hub, mirrors SkillGraphNode */
  parent?: string;
}

export const SKILLS: Skill[] = [
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

// All copy below is the author's real text, transcribed verbatim from the source Figma export
// (project/ui_kits/portfolio/{Hero,About,Contact}Screen.jsx) — not placeholder.
export const SITE = {
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
