/**
 * Filter Controls Component
 *
 * Collapsible browse section with artist and county filters
 * Updates nanostore state which is observed by Map component
 */

import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { selectedArtists, selectedCounties, clearAllFilters } from '../stores/filters';

interface FilterControlsProps {
  artists: Array<{ slug: string; name: string }>;
  counties: string[];
}

export default function FilterControls({ artists, counties }: FilterControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeArtists = useStore(selectedArtists);
  const activeCounties = useStore(selectedCounties);

  console.log('FilterControls - Artists:', artists.length, 'Counties:', counties.length);

  const toggleArtist = (slug: string) => {
    if (activeArtists.includes(slug)) {
      selectedArtists.set(activeArtists.filter((s) => s !== slug));
    } else {
      selectedArtists.set([...activeArtists, slug]);
    }
  };

  const toggleCounty = (county: string) => {
    if (activeCounties.includes(county)) {
      selectedCounties.set(activeCounties.filter((c) => c !== county));
    } else {
      selectedCounties.set([...activeCounties, county]);
    }
  };

  const hasActiveFilters = activeArtists.length > 0 || activeCounties.length > 0;

  return (
    <div className="filter-controls">
      <button
        className="browse-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="browse-title">BROWSE</span>
        <span className="browse-icon">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className="filter-content">
          {/* Artist Filter */}
          <div className="filter-group">
            <label className="filter-label">Artist:</label>
            <div className="checkbox-list">
              {artists.map((artist) => (
                <label key={artist.slug} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={activeArtists.includes(artist.slug)}
                    onChange={() => toggleArtist(artist.slug)}
                  />
                  <span>{artist.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* County Filter */}
          <div className="filter-group">
            <label className="filter-label">County:</label>
            <div className="checkbox-list">
              {counties.map((county) => (
                <label key={county} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={activeCounties.includes(county)}
                    onChange={() => toggleCounty(county)}
                  />
                  <span>{county}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <button className="clear-btn" onClick={clearAllFilters}>
              Clear All
            </button>
          )}
        </div>
      )}

      <style>{`
        .filter-controls {
          background: transparent;
        }

        .browse-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .browse-toggle:hover {
          opacity: 0.7;
        }

        .browse-title {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-primary);
        }

        .browse-icon {
          font-size: 0.7rem;
          color: var(--color-text-secondary);
        }

        .filter-content {
          padding: var(--spacing-sm) 0;
          padding-bottom: var(--spacing-lg);
          background: transparent;
          max-height: 400px;
          overflow-y: scroll !important;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        .filter-content::-webkit-scrollbar {
          width: 4px;
        }

        .filter-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .filter-content::-webkit-scrollbar-thumb {
          background: var(--color-ornament-gold);
          border-radius: 2px;
        }

        .filter-group {
          margin-bottom: var(--spacing-md);
        }

        .filter-group:last-of-type {
          margin-bottom: 0;
        }

        .filter-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .checkbox-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--color-text-primary);
          cursor: pointer;
          padding: 0.3rem 0;
          transition: opacity 0.2s ease;
          background: transparent;
          border: none;
        }

        .checkbox-item:hover {
          opacity: 0.7;
        }

        .checkbox-item input[type="checkbox"] {
          cursor: pointer;
          accent-color: var(--color-ornament-gold);
          width: 14px;
          height: 14px;
        }

        .clear-btn {
          width: 100%;
          margin-top: var(--spacing-md);
          padding: 0.5rem;
          background: transparent;
          border: 1px solid var(--color-ornament-gold);
          border-radius: 4px;
          color: var(--color-ornament-gold);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          background: var(--color-ornament-gold);
          color: white;
        }
      `}</style>
    </div>
  );
}
