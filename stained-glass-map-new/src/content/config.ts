import { defineCollection, z } from 'astro:content';

/**
 * Content Collections Configuration
 *
 * Defines schemas for locations and artists YAML files
 */

// Location schema
const locations = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    coordinates: z.tuple([z.number(), z.number()]), // [lat, lng]
    address: z.string().nullable(),
    county: z.string(),
    google_maps_link: z.string().url().nullable(),
    description: z.string().nullable(),
    windows: z.array(z.object({
      title: z.string(),
      artist: z.string().nullable(), // Slug reference to artist
      year: z.number().nullable(),
      description: z.string().nullable(),
      images: z.array(z.object({
        url: z.string(),
        alt: z.string().optional(),
        caption: z.string().optional(),
      })),
    })),
  }),
});

// Artist schema
const artists = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    birth_year: z.number().nullable(),
    death_year: z.number().nullable(),
    biography: z.string(),
    portrait_url: z.string().optional(),
  }),
});

// Export collections
export const collections = {
  locations,
  artists,
};
