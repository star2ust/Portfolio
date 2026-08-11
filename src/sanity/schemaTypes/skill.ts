import { defineField, defineType } from "sanity";

/** A node in the Skills force graph. */
export const skill = defineType({
  name: "skill",
  title: "Навык",
  type: "document",
  groups: [
    { name: "russian", title: "Русский", default: true },
    { name: "english", title: "English" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Название",
      type: "string",
      description: 'Как в графе — родная капитализация инструмента, например "TouchDesigner"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "level",
      title: "Уровень",
      type: "number",
      description: "От 1 до 5, с шагом 0.5 — например 3.5 или 4.5. Дробная часть .5 показывается как наполовину закрашенная точка.",
      options: { list: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] },
      validation: (r) =>
        r
          .required()
          .min(1)
          .max(5)
          .custom((v) => (typeof v === "number" && v * 2 === Math.round(v * 2) ? true : "Шаг должен быть 0.5")),
    }),
    defineField({
      name: "body",
      title: "Описание",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "parent",
      title: "Ответвляется от",
      type: "reference",
      to: [{ type: "skill" }],
      description:
        "Если выбрать другой навык, этот узел на графе будет исходить от него, а не от центра. Пусто = соединяется с центром.",
      options: { disableNew: true },
      validation: (r) =>
        r.custom((value, ctx) =>
          value && (value as { _ref?: string })._ref === ctx.document?._id ? "Навык не может ссылаться сам на себя" : true,
        ),
    }),
    defineField({
      name: "bodyEn",
      title: "EN — Описание",
      type: "text",
      rows: 4,
      description: "Пусто = на англоязычной версии сайта используется русский текст.",
      group: "english",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "level" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `Уровень ${subtitle}` }),
  },
});
