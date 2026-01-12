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

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    const total = location.windows.length;
    if (direction === 'prev') {
      setSelectedImageIndex((selectedImageIndex - 1 + total) % total);
    } else {
      setSelectedImageIndex((selectedImageIndex + 1) % total);
    }
  };

  return (
    <>
      {/* Main Modal */}
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Decorative corner elements */}
          <div className="corner-decor top-left" />
          <div className="corner-decor top-right" />
          <div className="corner-decor bottom-left" />
          <div className="corner-decor bottom-right" />

          <div className="modal-header">
            <h2 className="modal-title">{location.name}</h2>
            <div className="modal-meta">
              <span className="modal-county">{location.county}</span>
              {location.address && (
                <>
                  <span className="meta-divider">•</span>
                  <span className="modal-address">{location.address}</span>
                </>
              )}
            </div>
          </div>

          {location.description && (
            <div className="modal-description">
              <p>{location.description}</p>
            </div>
          )}

          <div className="windows-section">
            <div className="section-header">
              <div className="section-line" />
              <h3 className="section-title">Stained Glass Windows</h3>
              <div className="section-line" />
            </div>
            <div className="windows-grid">
              {location.windows.map((window, idx) => (
                <div
                  key={idx}
                  className="window-card"
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  {window.images[0] && (
                    <div className="window-image-container">
                      <img
                        src={window.images[0].url}
                        alt={window.images[0].alt || window.title}
                        className="window-image"
                      />
                      <div className="window-overlay">
                        <span className="view-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                            <path d="M11 8v6M8 11h6" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="window-info">
                    <h4 className="window-title">{window.title}</h4>
                    {window.artist && (
                      <a
                        href={`/artists/${window.artist}`}
                        className="window-artist-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {artistNames[window.artist] || window.artist}
                      </a>
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
            <div className="modal-footer">
              <a
                href={location.google_maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="maps-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>View on Google Maps</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Image Viewer (Lightbox) */}
      {selectedImageIndex !== null && (
        <div className="lightbox" onClick={closeImageViewer}>
          <button className="lightbox-close" onClick={closeImageViewer} aria-label="Close">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {location.windows.length > 1 && (
            <>
              <button
                className="lightbox-nav lightbox-prev"
                onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                aria-label="Previous image"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="lightbox-nav lightbox-next"
                onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                aria-label="Next image"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={location.windows[selectedImageIndex].images[0]?.url}
              alt={location.windows[selectedImageIndex].title}
              className="lightbox-image"
            />
            <div className="lightbox-caption">
              <h4>{location.windows[selectedImageIndex].title}</h4>
              {location.windows[selectedImageIndex].artist && (
                <p className="lightbox-artist">
                  {artistNames[location.windows[selectedImageIndex].artist!] ||
                    location.windows[selectedImageIndex].artist}
                </p>
              )}
              {location.windows.length > 1 && (
                <p className="lightbox-counter">
                  {selectedImageIndex + 1} / {location.windows.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(20, 15, 10, 0.85);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--spacing-lg);
          overflow-y: auto;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-content {
          background: linear-gradient(
            135deg,
            var(--color-parchment) 0%,
            #f5efe3 50%,
            var(--color-parchment) 100%
          );
          border: none;
          border-radius: 12px;
          max-width: 950px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
          position: relative;
          box-shadow:
            0 0 0 1px rgba(201, 169, 97, 0.3),
            0 4px 6px rgba(0, 0, 0, 0.1),
            0 20px 60px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          animation: slideUp 0.3s ease-out;
        }

        /* Decorative corners */
        .corner-decor {
          position: absolute;
          width: 40px;
          height: 40px;
          opacity: 0.4;
        }

        .corner-decor::before,
        .corner-decor::after {
          content: '';
          position: absolute;
          background: var(--color-ornament-gold);
        }

        .corner-decor.top-left { top: 12px; left: 12px; }
        .corner-decor.top-right { top: 12px; right: 12px; transform: rotate(90deg); }
        .corner-decor.bottom-left { bottom: 12px; left: 12px; transform: rotate(-90deg); }
        .corner-decor.bottom-right { bottom: 12px; right: 12px; transform: rotate(180deg); }

        .corner-decor::before {
          width: 20px;
          height: 2px;
          top: 0;
          left: 0;
        }

        .corner-decor::after {
          width: 2px;
          height: 20px;
          top: 0;
          left: 0;
        }

        .modal-close {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          background: transparent;
          border: 1px solid rgba(201, 169, 97, 0.3);
          color: var(--color-text-secondary);
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .modal-close:hover {
          background: var(--color-ornament-gold);
          border-color: var(--color-ornament-gold);
          color: white;
          transform: rotate(90deg);
        }

        .modal-header {
          margin-bottom: var(--spacing-lg);
          padding-right: var(--spacing-xl);
          text-align: center;
          padding-top: var(--spacing-sm);
        }

        .modal-title {
          margin: 0 0 var(--spacing-sm) 0;
          font-family: var(--font-heading);
          font-size: 2.2rem;
          color: var(--color-ornament-gold);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          letter-spacing: 0.02em;
        }

        .modal-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .modal-county {
          font-size: 1rem;
          color: var(--color-accent-brown);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .meta-divider {
          color: var(--color-ornament-gold);
          opacity: 0.5;
        }

        .modal-address {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .modal-description {
          margin-bottom: var(--spacing-lg);
          padding: var(--spacing-md) var(--spacing-lg);
          background: rgba(255, 255, 255, 0.6);
          border-left: 3px solid var(--color-ornament-gold);
          border-radius: 0 8px 8px 0;
          position: relative;
        }

        .modal-description::before {
          content: '"';
          position: absolute;
          top: -10px;
          left: var(--spacing-md);
          font-size: 3rem;
          color: var(--color-ornament-gold);
          opacity: 0.3;
          font-family: Georgia, serif;
          line-height: 1;
        }

        .modal-description p {
          margin: 0;
          line-height: 1.7;
          color: var(--color-text-primary);
          font-size: 0.95rem;
        }

        .windows-section {
          margin-bottom: var(--spacing-lg);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .section-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--color-ornament-gold) 50%,
            transparent
          );
        }

        .section-title {
          margin: 0;
          font-size: 0.85rem;
          color: var(--color-ornament-gold);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 600;
          white-space: nowrap;
        }

        .windows-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--spacing-md);
        }

        .window-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.05),
            0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .window-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 8px 16px rgba(201, 169, 97, 0.2),
            0 16px 32px rgba(0, 0, 0, 0.1);
        }

        .window-image-container {
          position: relative;
          overflow: hidden;
        }

        .window-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .window-card:hover .window-image {
          transform: scale(1.05);
        }

        .window-overlay {
          position: absolute;
          inset: 0;
          background: rgba(20, 15, 10, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .window-card:hover .window-overlay {
          opacity: 1;
        }

        .view-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-ornament-gold);
          transform: scale(0.8);
          transition: transform 0.3s ease;
        }

        .window-card:hover .view-icon {
          transform: scale(1);
        }

        .window-info {
          padding: var(--spacing-sm) var(--spacing-md);
          border-top: 2px solid rgba(201, 169, 97, 0.2);
        }

        .window-title {
          margin: 0 0 0.25rem 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.3;
        }

        .window-artist-link {
          display: block;
          margin: 0;
          font-size: 0.85rem;
          color: var(--color-ornament-gold);
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .window-artist-link:hover {
          color: var(--color-accent-brown);
          text-decoration: underline;
        }

        .window-year {
          margin: 0.25rem 0 0 0;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .modal-footer {
          display: flex;
          justify-content: center;
          padding-top: var(--spacing-md);
          border-top: 1px solid rgba(201, 169, 97, 0.2);
        }

        .maps-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: var(--spacing-sm) var(--spacing-lg);
          background: transparent;
          border: 2px solid var(--color-ornament-gold);
          border-radius: 100px;
          color: var(--color-ornament-gold);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .maps-link:hover {
          background: var(--color-ornament-gold);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(201, 169, 97, 0.4);
        }

        /* Lightbox */
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 8, 5, 0.97);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: var(--spacing-xl);
          animation: fadeIn 0.2s ease-out;
        }

        .lightbox-close {
          position: absolute;
          top: var(--spacing-lg);
          right: var(--spacing-lg);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .lightbox-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .lightbox-nav:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .lightbox-prev {
          left: var(--spacing-lg);
        }

        .lightbox-next {
          right: var(--spacing-lg);
        }

        .lightbox-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 90%;
          max-height: 90%;
        }

        .lightbox-image {
          max-width: 100%;
          max-height: calc(90vh - 100px);
          object-fit: contain;
          border-radius: 4px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .lightbox-caption {
          text-align: center;
          margin-top: var(--spacing-md);
          color: white;
        }

        .lightbox-caption h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .lightbox-artist {
          margin: 0.25rem 0 0 0;
          font-size: 0.95rem;
          color: var(--color-ornament-gold);
        }

        .lightbox-counter {
          margin: 0.5rem 0 0 0;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 0;
          }

          .modal-content {
            padding: var(--spacing-lg) var(--spacing-md);
            max-height: 100vh;
            border-radius: 0;
          }

          .modal-title {
            font-size: 1.6rem;
          }

          .corner-decor {
            display: none;
          }

          .windows-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: var(--spacing-sm);
          }

          .window-image {
            height: 150px;
          }

          .lightbox-nav {
            width: 44px;
            height: 44px;
          }

          .lightbox-prev {
            left: var(--spacing-sm);
          }

          .lightbox-next {
            right: var(--spacing-sm);
          }
        }

        /* Scrollbar styling */
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: var(--color-ornament-gold);
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: var(--color-accent-brown);
        }
      `}</style>
    </>
  );
}
