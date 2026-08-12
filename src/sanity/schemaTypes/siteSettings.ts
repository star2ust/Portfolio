import { defineField, defineType } from "sanity";

const specField = defineField({
  name: "spec",
  title: "Строка",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Метка", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", title: "Значение", type: "text", rows: 2, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});

const contactRow = defineField({
  name: "contactRow",
  title: "Строка контакта",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Метка (например tg:)", type: "string" }),
    defineField({ name: "value", title: "Значение", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", title: "Ссылка", type: "url", validation: (r) => r.required() }),
    defineField({ name: "mark", title: "Показывать значок ↗", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

/** Singleton: everything on Hero/About/Contact/Work/Skills that isn't a project or a skill node.
 *  Only one document of this type should ever exist — see sanity/structure.ts, which pins it
 *  in the desk UI instead of offering "create new". */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Настройки сайта",
  type: "document",
  groups: [
    { name: "russian", title: "Русский", default: true },
    { name: "english", title: "English" },
  ],
  fields: [
    defineField({ name: "name", title: "Имя", type: "string", initialValue: "Хабаров Егор" }),
    defineField({ name: "role", title: "Роль", type: "string", initialValue: "Interactive Developer" }),
    defineField({
      name: "heroVideo",
      title: "Видео на главной",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "heroSpecs",
      title: "Главная — строка спецификации",
      type: "array",
      of: [specField],
      validation: (r) => r.length(3),
    }),
    defineField({
      name: "aboutTitle",
      title: "Обо мне — заголовок",
      type: "string",
      initialValue: "ОБО МНЕ",
    }),
    defineField({ name: "aboutLede", title: "Обо мне — подзаголовок", type: "text", rows: 2 }),
    defineField({ name: "aboutBody1", title: "Обо мне — текст 1", type: "text", rows: 4 }),
    defineField({ name: "aboutBody2", title: "Обо мне — текст 2", type: "text", rows: 4 }),
    defineField({
      name: "aboutPortrait",
      title: "Обо мне — портрет",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "aboutMeta",
      title: "Обо мне — строка фактов (ИМЯ / РОЛЬ / КОНТАКТЫ)",
      type: "array",
      of: [specField],
    }),
    defineField({ name: "workLede", title: "Проекты — лид-текст", type: "text", rows: 3 }),
    defineField({
      name: "skillsEmptyState",
      title: "Навыки — подсказка до выбора узла",
      type: "string",
      initialValue: "Коснитесь узла графа, чтобы раскрыть навык.",
    }),
    defineField({ name: "contactTitle", title: "Контакты — заголовок", type: "string", initialValue: "Связь." }),
    defineField({
      name: "contactRows",
      title: "Контакты — строки",
      type: "array",
      of: [contactRow],
    }),
    defineField({
      name: "nameEn",
      title: "EN — Имя",
      type: "string",
      description: "Пусто = на англоязычной версии сайта используется русское имя.",
      group: "english",
    }),
    defineField({ name: "roleEn", title: "EN — Роль", type: "string", group: "english" }),
    defineField({
      name: "heroSpecsEn",
      title: "EN — Главная — строка спецификации",
      type: "array",
      of: [specField],
      description: "Пусто = на англоязычной версии сайта используется русский текст.",
      group: "english",
    }),
    defineField({ name: "aboutTitleEn", title: "EN — Обо мне — заголовок", type: "string", group: "english" }),
    defineField({ name: "aboutLedeEn", title: "EN — Обо мне — подзаголовок", type: "text", rows: 2, group: "english" }),
    defineField({ name: "aboutBody1En", title: "EN — Обо мне — текст 1", type: "text", rows: 4, group: "english" }),
    defineField({ name: "aboutBody2En", title: "EN — Обо мне — текст 2", type: "text", rows: 4, group: "english" }),
    defineField({
      name: "aboutMetaEn",
      title: "EN — Обо мне — строка фактов",
      type: "array",
      of: [specField],
      group: "english",
    }),
    defineField({ name: "workLedeEn", title: "EN — Проекты — лид-текст", type: "text", rows: 3, group: "english" }),
    defineField({
      name: "skillsEmptyStateEn",
      title: "EN — Навыки — подсказка до выбора узла",
      type: "string",
      group: "english",
    }),
    defineField({ name: "contactTitleEn", title: "EN — Контакты — заголовок", type: "string", group: "english" }),
  ],
  preview: {
    prepare: () => ({ title: "Настройки сайта" }),
  },
});
