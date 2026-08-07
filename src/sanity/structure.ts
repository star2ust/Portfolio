import type { StructureResolver } from "sanity/structure";

/** Pins "Настройки сайта" as a singleton (edit the one document, no "create new" / list view)
 *  and orders Projects by their `order` field. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Настройки сайта")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("project").title("Проекты"),
      S.documentTypeListItem("skill").title("Навыки"),
    ]);
