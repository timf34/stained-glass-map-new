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

      <style>{`
        .works-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: var(--spacing-md);
        }

        .work-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(201, 169, 97, 0.2);
          cursor: pointer;
          text-align: left;
          padding: 0;
          width: 100%;
        }

        .work-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(201, 169, 97, 0.2);
          border-color: var(--color-ornament-gold);
        }

        .work-image-container {
          aspect-ratio: 4/3;
          overflow: hidden;
        }

        .work-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .work-card:hover .work-image {
          transform: scale(1.05);
        }

        .work-info {
          padding: var(--spacing-sm) var(--spacing-md);
          border-top: 2px solid rgba(201, 169, 97, 0.2);
        }

        .work-title {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.3;
        }

        .work-location {
          margin: 0;
          font-size: 0.9rem;
          color: var(--color-ornament-gold);
          font-weight: 500;
        }

        .work-county {
          margin: 0.25rem 0 0 0;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .work-year {
          margin: 0.5rem 0 0 0;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          font-style: italic;
        }

        @media (max-width: 768px) {
          .works-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: var(--spacing-sm);
          }
        }
      `}</style>
    </>
  );
}
