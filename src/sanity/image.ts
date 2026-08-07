import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Sanity's CDN does the resizing/format conversion — call with a target width so we're never
 *  shipping a full-resolution upload to a phone. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
