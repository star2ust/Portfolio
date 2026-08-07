import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // false: every read goes to Sanity's live API, not the (cheaper but eventually-consistent)
      // CDN — combined with the on-demand revalidation webhook, publishing in Studio shows up on
      // the site within seconds instead of waiting out the CDN's own cache window.
      useCdn: false,
    })
  : null;
