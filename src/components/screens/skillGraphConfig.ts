export interface SkillGraphBaseConfig {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  radius: number;
  dot: number;
  hub: number;
  fontSize: number;
  /** "side" = info panel beside the graph; "below" = full-width panel under it */
  panel: "side" | "below";
}

// Ground truth from the source JSX (see project/ui_kits/portfolio*/SkillsScreen.jsx) —
// one config per anchor breakpoint, matching the same bands as tokens/breakpoints.css.
export const SKILL_GRAPH_CONFIGS: Record<"mobile" | "tabletPortrait" | "tabletLandscape" | "laptop" | "desktop", SkillGraphBaseConfig> = {
  mobile: { width: 360, height: 330, centerX: 180, centerY: 162, radius: 93, dot: 11, hub: 18, fontSize: 10, panel: "below" },
  tabletPortrait: { width: 768, height: 600, centerX: 384, centerY: 296, radius: 186, dot: 13, hub: 22, fontSize: 11, panel: "below" },
  tabletLandscape: { width: 1024, height: 768, centerX: 646, centerY: 396, radius: 196, dot: 13, hub: 22, fontSize: 11, panel: "side" },
  laptop: { width: 1440, height: 900, centerX: 940, centerY: 470, radius: 260, dot: 15, hub: 25, fontSize: 12, panel: "side" },
  desktop: { width: 1920, height: 1080, centerX: 1230, centerY: 560, radius: 340, dot: 18, hub: 30, fontSize: 14, panel: "side" },
};

/** Picks the base config for a given viewport, mirroring the CSS breakpoint bands exactly. */
export function pickSkillGraphBase(viewportWidth: number, orientation: "portrait" | "landscape"): SkillGraphBaseConfig {
  if (viewportWidth < 768) return SKILL_GRAPH_CONFIGS.mobile;
  if (viewportWidth <= 1113) return orientation === "landscape" ? SKILL_GRAPH_CONFIGS.tabletLandscape : SKILL_GRAPH_CONFIGS.tabletPortrait;
  if (viewportWidth < 1920) return SKILL_GRAPH_CONFIGS.laptop;
  return SKILL_GRAPH_CONFIGS.desktop;
}

/** Scales a base config to the container's actual measured size, so the graph is genuinely
 *  fluid within a band (exact at the anchor width, interpolated elsewhere) instead of snapping.
 *
 *  For "below"-panel configs (mobile, tablet-portrait) the graph is meant to sit centred, and
 *  their base centerX is exactly width/2 — but a node label ("TouchDesigner") extends well past
 *  its dot, so scaling the raw node *positions* to fill the full container clips labels at the
 *  edge (confirmed by a real 26px page overflow at 360px). A fixed margin keeps the node spread
 *  itself inset from both edges, leaving room for label overhang.
 *
 *  For "side"-panel configs (the ones that share a viewport-height container with no page
 *  scroll — see SkillsScreen.module.css), scaling to width alone assumes the container's real
 *  aspect ratio matches the base config's ~16:9 exactly. A real browser viewport essentially
 *  never does (toolbar/tab-strip chrome eats into the height a "1920×1080" window actually has
 *  to give), so a width-only scale could still render a graph taller than the space actually
 *  available and force a scrollbar. Fits both axes at once instead — like object-fit: contain —
 *  and centers the result in whatever leftover space is left on the shorter axis. */
export function scaleSkillGraphConfig(
  base: SkillGraphBaseConfig,
  measuredWidth: number,
  measuredHeight?: number
): SkillGraphBaseConfig {
  if (base.panel === "below" || !measuredHeight) {
    const margin = base.panel === "below" ? 36 : 0;
    const usableWidth = Math.max(measuredWidth - margin * 2, 1);
    const scale = usableWidth / base.width;
    const centerX = base.panel === "below" ? measuredWidth / 2 : base.centerX * scale;
    return {
      ...base,
      width: measuredWidth,
      height: base.height * scale,
      centerX,
      centerY: base.centerY * scale,
      radius: base.radius * scale,
      dot: base.dot * scale,
      hub: base.hub * scale,
      fontSize: base.fontSize * scale,
    };
  }

  const scale = Math.min(measuredWidth / base.width, measuredHeight / base.height);
  const offsetX = (measuredWidth - base.width * scale) / 2;
  const offsetY = (measuredHeight - base.height * scale) / 2;
  return {
    ...base,
    width: measuredWidth,
    height: measuredHeight,
    centerX: base.centerX * scale + offsetX,
    centerY: base.centerY * scale + offsetY,
    radius: base.radius * scale,
    dot: base.dot * scale,
    hub: base.hub * scale,
    fontSize: base.fontSize * scale,
  };
}
