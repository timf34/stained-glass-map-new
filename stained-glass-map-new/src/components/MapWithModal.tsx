/**
 * Map With Modal Wrapper
 *
 * Combines Map and LocationModal with shared state
 */

import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import Map from './Map';
import LocationModal from './LocationModal';
import { selectedLocationId as storeSelectedLocationId, clearSelectedLocation } from '../stores/mapStore';

interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
  county: string;
  artists: string[];
}

interface FullLocation {
  id: string;
  name: string;
  address: string | null;
  county: string;
  description: string | null;
  google_maps_link: string | null;
  windows: Array<{
    title: string;
    artist: string | null;
    year: number | null;
    description: string | null;
    images: Array<{
      url: string;
      alt?: string;
    }>;
  }>;
}

interface MapWithModalProps {
  locations: Location[];
  fullLocations: FullLocation[];
  artistNames: Record<string, string>;
  mapboxToken: string;
}

export default function MapWithModal({
  locations,
  fullLocations,
  artistNames,
  mapboxToken,
}: MapWithModalProps) {
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);
  const storeSelectedId = useStore(storeSelectedLocationId);

  // Use either store or local selection (store takes precedence)
  const selectedId = storeSelectedId || localSelectedId;

  // Check for location query parameter on mount (for deep linking from artist pages)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const locationParam = params.get('location');
      if (locationParam) {
        // Verify the location exists
        const locationExists = fullLocations.some((loc) => loc.id === locationParam);
        if (locationExists) {
          setLocalSelectedId(locationParam);
        }
        // Clean up the URL without triggering a page reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [fullLocations]);

  // When store selection changes, update local and clear store
  useEffect(() => {
    if (storeSelectedId) {
      setLocalSelectedId(storeSelectedId);
      // Clear the store after reading to avoid conflicts
      clearSelectedLocation();
    }
  }, [storeSelectedId]);

  const selectedLocation = selectedId
    ? fullLocations.find((loc) => loc.id === selectedId) || null
    : null;

  const handleMarkerClick = (locationId: string) => {
    setLocalSelectedId(locationId);
  };

  const closeModal = () => {
    setLocalSelectedId(null);
    clearSelectedLocation();
  };

  // Make handleMarkerClick available globally for map markers
  if (typeof window !== 'undefined') {
    (window as any).openLocationModal = handleMarkerClick;
  }

  return (
    <>
      <Map
        locations={locations}
        mapboxToken={mapboxToken}
        onMarkerClick={handleMarkerClick}
      />

      <LocationModal
        location={selectedLocation}
        artistNames={artistNames}
        isOpen={selectedLocation !== null}
        onClose={closeModal}
      />
    </>
  );
}
