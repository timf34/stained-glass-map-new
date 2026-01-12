/**
 * Location Modal Component
 *
 * Full-screen modal showing location details and window gallery
 */

import { useState } from 'react';

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

interface LocationData {
  name: string;
  address: string | null;
  county: string;
  description: string | null;
  google_maps_link: string | null;
  windows: Window[];
}

interface LocationModalProps {
  location: LocationData | null;
  artistNames: Record<string, string>; // slug -> name
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationModal({
  location,
  artistNames,
  isOpen,
  onClose,
}: LocationModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!isOpen || !location) return null;

  const closeImageViewer = () => setSelectedImageIndex(null);

  return (
    <>
      {/* Main Modal */}
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>

          <div className="modal-header">
            <h2 className="modal-title">{location.name}</h2>
            <p className="modal-county">{location.county}</p>
            {location.address && (
              <p className="modal-address">{location.address}</p>
            )}
          </div>

          {location.description && (
            <div className="modal-description">
              <p>{location.description}</p>
            </div>
          )}

          <div className="windows-section">
            <h3 className="section-title">Stained Glass Windows</h3>
            <div className="windows-grid">
              {location.windows.map((window, idx) => (
                <div key={idx} className="window-card">
                  {window.images[0] && (
                    <img
                      src={window.images[0].url}
                      alt={window.images[0].alt || window.title}
                      className="window-image"
                      onClick={() => setSelectedImageIndex(idx)}
                    />
                  )}
                  <div className="window-info">
                    <h4 className="window-title">{window.title}</h4>
                    {window.artist && (
                      <p className="window-artist">
                        {artistNames[window.artist] || window.artist}
                      </p>
                    )}
                    {window.year && (
                      <p className="window-year">{window.year}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {location.google_maps_link && (
            <a
              href={location.google_maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="maps-link"
            >
              View on Google Maps →
            </a>
          )}
        </div>
      </div>

      {/* Image Viewer (Lightbox) */}
      {selectedImageIndex !== null && (
        <div className="lightbox" onClick={closeImageViewer}>
          <button className="lightbox-close" onClick={closeImageViewer}>
            ×
          </button>
          <img
            src={location.windows[selectedImageIndex].images[0]?.url}
            alt={location.windows[selectedImageIndex].title}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--spacing-md);
          overflow-y: auto;
        }

        .modal-content {
          background: var(--color-parchment);
          border: 2px solid var(--color-border);
          border-radius: 8px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: var(--spacing-xl);
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-close {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          background: transparent;
          border: none;
          font-size: 2rem;
          color: var(--color-text-secondary);
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all var(--transition-fast);
        }

        .modal-close:hover {
          background: var(--color-hover-bg);
          color: var(--color-text-primary);
        }

        .modal-header {
          margin-bottom: var(--spacing-lg);
          padding-right: var(--spacing-xl);
        }

        .modal-title {
          margin: 0 0 var(--spacing-xs) 0;
          font-family: var(--font-heading);
          font-size: 2rem;
          color: var(--color-ornament-gold);
        }

        .modal-county {
          margin: 0;
          font-size: 1.1rem;
          color: var(--color-accent-brown);
          font-weight: 600;
        }

        .modal-address {
          margin: var(--spacing-xs) 0 0 0;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .modal-description {
          margin-bottom: var(--spacing-lg);
          padding: var(--spacing-md);
          background: rgba(255, 255, 255, 0.5);
          border-left: 3px solid var(--color-ornament-gold);
          border-radius: 4px;
        }

        .modal-description p {
          margin: 0;
          line-height: 1.6;
        }

        .windows-section {
          margin-bottom: var(--spacing-lg);
        }

        .section-title {
          margin: 0 0 var(--spacing-md) 0;
          font-size: 1.25rem;
          color: var(--color-ornament-gold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: var(--spacing-xs);
        }

        .windows-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .window-card {
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          overflow: hidden;
          transition: all var(--transition-normal);
          cursor: pointer;
        }

        .window-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(201, 169, 97, 0.3);
        }

        .window-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .window-info {
          padding: var(--spacing-sm);
        }

        .window-title {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.3;
        }

        .window-artist {
          margin: 0;
          font-size: 0.85rem;
          color: var(--color-ornament-gold);
          font-weight: 500;
        }

        .window-year {
          margin: 0.25rem 0 0 0;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .maps-link {
          display: inline-block;
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          color: var(--color-ornament-gold);
          text-decoration: none;
          font-weight: 500;
          transition: all var(--transition-normal);
        }

        .maps-link:hover {
          background: var(--color-ornament-gold);
          color: var(--color-card-bg);
          border-color: var(--color-ornament-gold);
        }

        /* Lightbox */
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: var(--spacing-xl);
        }

        .lightbox-close {
          position: absolute;
          top: var(--spacing-lg);
          right: var(--spacing-lg);
          background: rgba(255, 255, 255, 0.1);
          border: none;
          font-size: 3rem;
          color: white;
          cursor: pointer;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all var(--transition-fast);
        }

        .lightbox-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .lightbox-image {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
          border-radius: 4px;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .modal-content {
            padding: var(--spacing-md);
            max-height: 100vh;
            border-radius: 0;
          }

          .modal-title {
            font-size: 1.5rem;
          }

          .windows-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: var(--spacing-sm);
          }

          .window-image {
            height: 150px;
          }
        }
      `}</style>
    </>
  );
}
