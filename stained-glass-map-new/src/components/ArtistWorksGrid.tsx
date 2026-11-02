import '../styles/ArtistWorksGrid.css';
/**
 * Artist Works Grid Component
 *
 * Displays works by an artist with clickable cards that open location modals
 */

import { useState } from 'react';
import LocationModal from './LocationModal';

interface Window {
  title: string;
  artist: string | null;
  year: number | null;
  description: string | null;
  images: Array<{
    url: string;
    alt?: string;
  }>;
}

interface FullLocation {
  id: string;
  name: string;
  address: string | null;
  county: string;
  description: string | null;
  google_maps_link: string | null;
  windows: Window[];
}

interface WorkItem {
  window: {
    title: string;
    year: number | null;
    images: Array<{ url: string; alt?: string }>;
  };
  locationId: string;
  locationName: string;
  locationCounty: string;
}

interface ArtistWorksGridProps {
  works: WorkItem[];
  fullLocations: FullLocation[];
  artistNames: Record<string, string>;
}

export default function ArtistWorksGrid({
  works,
  fullLocations,
  artistNames
}: ArtistWorksGridProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const selectedLocation = selectedLocationId
    ? fullLocations.find((loc) => loc.id === selectedLocationId) || null
    : null;

  const openModal = (locationId: string) => {
    setSelectedLocationId(locationId);
  };

  const closeModal = () => {
    setSelectedLocationId(null);
  };

  return (
    <>
      <div className="works-grid">
        {works.map((item, index) => (
          <button
            key={`${item.locationId}-${index}`}
            className="work-card"
            onClick={() => openModal(item.locationId)}
          >
            {item.window.images[0] && (
              <div className="work-image-container">
                <img
                  src={item.window.images[0].url}
                  alt={item.window.title}
                  className="work-image"
                  loading="lazy"
                />
              </div>
            )}
            <div className="work-info">
              <h3 className="work-title">{item.window.title}</h3>
              <p className="work-location">{item.locationName}</p>
              <p className="work-county">{item.locationCounty}</p>
              {item.window.year && (
                <p className="work-year">{item.window.year}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      <LocationModal
        location={selectedLocation}
        artistNames={artistNames}
        isOpen={selectedLocation !== null}
        onClose={closeModal}
      />


    </>
  );
}
