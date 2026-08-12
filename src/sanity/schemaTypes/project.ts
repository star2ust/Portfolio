import { defineField, defineType } from "sanity";

/** A work-grid item + its detail page. Mirrors src/lib/content.ts's Project interface —
 *  see queries.ts for how a Sanity document maps back onto that shape. */
export const project = defineType({
  name: "project",
  title: "Проект",
  type: "document",
  groups: [
    { name: "russian", title: "Русский", default: true },
    { name: "english", title: "English" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Название (подпись на карточке)",
      type: "string",
      description: 'Sentence case, как оно появится в сетке. Пример: интерактивная инсталляция "поле цветов"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (для ссылки /work/...)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tech",
      title: "Технологии",
      type: "string",
      description: 'Через обратный слэш: "touchdesigner \\\\ unity"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year",
      title: "Год",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cover",
      title: "Обложка",
      type: "image",
      description: "Показывается в сетке проектов и как главное фото на странице проекта.",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      title: "Галерея",
      type: "array",
      description: "Дополнительные фото проекта — показываются на странице проекта под обложкой.",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "vimeoUrl",
      title: "Ссылка на видео (Vimeo)",
      type: "url",
      validation: (r) => r.uri({ allowRelative: false, scheme: ["http", "https"] }),
    }),
    defineField({
      name: "role",
      title: "Роль",
      type: "string",
      description: 'Пример: "Роль: Unity-разработчик"',
    }),
    defineField({
      name: "body",
      title: "Описание",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "tasks",
      title: "Задачи",
      type: "array",
      of: [{ type: "string" }],
      description: "Каждая строка — отдельная задача, без точек в конце.",
    }),
    defineField({
      name: "result",
      title: "Результат",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "titleEn",
      title: "EN — Название",
      type: "string",
      description: "Английский перевод названия. Пусто = на англоязычной версии сайта используется русский текст.",
      group: "english",
    }),
    defineField({
      name: "roleEn",
      title: "EN — Роль",
      type: "string",
      group: "english",
    }),
    defineField({
      name: "techEn",
      title: "EN — Технологии",
      type: "string",
      description: 'Через обратный слэш: "touchdesigner \\\\ unity". Пусто = используется русский текст.',
      group: "english",
    }),
    defineField({
      name: "bodyEn",
      title: "EN — Описание",
      type: "text",
      rows: 4,
      group: "english",
    }),
    defineField({
      name: "tasksEn",
      title: "EN — Задачи",
      type: "array",
      of: [{ type: "string" }],
      group: "english",
    }),
    defineField({
      name: "resultEn",
      title: "EN — Результат",
      type: "text",
      rows: 3,
      group: "english",
    }),
    defineField({
      name: "order",
      title: "Порядок в сетке",
      type: "number",
      description: "Меньше — раньше. Проекты сортируются по этому полю.",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "title", media: "cover", subtitle: "year" },
  },
});
