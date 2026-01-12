/**
 * Map With Modal Wrapper
 *
 * Combines Map and LocationModal with shared state
 */

import { useState } from 'react';
import Map from './Map';
import LocationModal from './LocationModal';

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
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const selectedLocation = selectedLocationId
    ? fullLocations.find((loc) => loc.id === selectedLocationId) || null
    : null;

  const handleMarkerClick = (locationId: string) => {
    setSelectedLocationId(locationId);
  };

  const closeModal = () => {
    setSelectedLocationId(null);
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
