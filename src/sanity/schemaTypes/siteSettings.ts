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
  ],
  preview: {
    prepare: () => ({ title: "Настройки сайта" }),
  },
});
