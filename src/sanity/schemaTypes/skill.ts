import { defineField, defineType } from "sanity";

/** A node in the Skills force graph. Graph *edges* (which node links to which) stay in code
 *  (src/components/screens/skillGraphEdges.ts) — that's a design decision, not content the
 *  author edits day to day; only name/level/body are here. */
export const skill = defineType({
  name: "skill",
  title: "Навык",
  type: "document",
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
      description: "От 1 до 5 — количество закрашенных точек.",
      validation: (r) => r.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "body",
      title: "Описание",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "level" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `Уровень ${subtitle}` }),
  },
});
