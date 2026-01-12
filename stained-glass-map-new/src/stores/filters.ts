/**
 * Filter State Management
 *
 * Uses nanostores for lightweight client-side state
 * Shared between Map and FilterControls components
 */

import { atom } from 'nanostores';

// Selected artists (array of artist slugs)
export const selectedArtists = atom<string[]>([]);

// Selected counties (array of county names)
export const selectedCounties = atom<string[]>([]);

// Helper: Clear all filters
export function clearAllFilters() {
  selectedArtists.set([]);
  selectedCounties.set([]);
}
