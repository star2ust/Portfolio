/** Which node links to which in the Skills force graph — a design decision (see
 *  project/ui_kits/portfolio/SkillsScreen.jsx's node list), not content the author edits day to
 *  day, so it lives in code rather than as a Sanity field. Anything not listed here links
 *  straight to the hub. Keyed by skill name as it appears in Sanity/content.ts. */
export const SKILL_GRAPH_PARENTS: Record<string, string> = {
  "AR\\VR": "Unity",
  Kinect: "TouchDesigner",
  "3D printing": "Fusion360",
};
