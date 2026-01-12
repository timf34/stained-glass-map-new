/**
 * Map State Management
 *
 * Uses nanostores for sharing map state between components
 */

import { atom } from 'nanostores';

// Selected location ID (to open modal from sidebar/drawer)
export const selectedLocationId = atom<string | null>(null);

// Clear selection
export function clearSelectedLocation() {
  selectedLocationId.set(null);
}
