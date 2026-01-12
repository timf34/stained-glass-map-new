/**
 * Sidebar Component
 *
 * Shows filter dropdowns and all locations list
 * Similar to old stained glass map website
 */

import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { selectedArtists, selectedCounties } from '../stores/filters';
import { selectedLocationId } from '../stores/mapStore';

interface Location {
  id: string;
  name: string;
  county: string;
  artists: string[];
  thumbnailUrl: string;
}

interface Artist {
  slug: string;
  name: string;
}

interface SidebarProps {
  locations: Location[];
  artists: Artist[];
  counties: string[];
}

export default function Sidebar({ locations, artists, counties }: SidebarProps) {
  const [artistDropdownOpen, setArtistDropdownOpen] = useState(false);
  const [countyDropdownOpen, setCountyDropdownOpen] = useState(false);

  const activeArtists = useStore(selectedArtists);
  const activeCounties = useStore(selectedCounties);

  // Filter locations based on selected filters
  const filteredLocations = locations.filter((location) => {
    const matchesArtist = activeArtists.length === 0 ||
      location.artists.some((artist) => activeArtists.includes(artist));
    const matchesCounty = activeCounties.length === 0 ||
      activeCounties.includes(location.county);
    return matchesArtist && matchesCounty;
  });

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

  const clearFilters = () => {
    selectedArtists.set([]);
    selectedCounties.set([]);
  };

  const hasActiveFilters = activeArtists.length > 0 || activeCounties.length > 0;

  const getArtistLabel = () => {
    if (activeArtists.length === 0) return 'Filter by Artist';
    if (activeArtists.length === 1) {
      const artist = artists.find(a => a.slug === activeArtists[0]);
      return artist?.name || 'Filter by Artist';
    }
    return `${activeArtists.length} Artists`;
  };

  const getCountyLabel = () => {
    if (activeCounties.length === 0) return 'Filter by County';
    if (activeCounties.length === 1) return activeCounties[0];
    return `${activeCounties.length} Counties`;
  };

  return (
    <div className="sidebar-content">
      {/* Filter Section */}
      <div className="filters">
        {/* Artist Dropdown */}
        <div className="dropdown">
          <button
            className={`dropdown-toggle ${activeArtists.length > 0 ? 'active' : ''}`}
            onClick={() => {
              setArtistDropdownOpen(!artistDropdownOpen);
              setCountyDropdownOpen(false);
            }}
          >
            <span>{getArtistLabel()}</span>
            <span className="dropdown-arrow">{artistDropdownOpen ? '▲' : '▼'}</span>
          </button>
          {artistDropdownOpen && (
            <div className="dropdown-menu">
              {artists.map((artist) => (
                <label key={artist.slug} className="dropdown-item">
                  <input
                    type="checkbox"
                    checked={activeArtists.includes(artist.slug)}
                    onChange={() => toggleArtist(artist.slug)}
                  />
                  <span>{artist.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* County Dropdown */}
        <div className="dropdown">
          <button
            className={`dropdown-toggle ${activeCounties.length > 0 ? 'active' : ''}`}
            onClick={() => {
              setCountyDropdownOpen(!countyDropdownOpen);
              setArtistDropdownOpen(false);
            }}
          >
            <span>{getCountyLabel()}</span>
            <span className="dropdown-arrow">{countyDropdownOpen ? '▲' : '▼'}</span>
          </button>
          {countyDropdownOpen && (
            <div className="dropdown-menu">
              {counties.map((county) => (
                <label key={county} className="dropdown-item">
                  <input
                    type="checkbox"
                    checked={activeCounties.includes(county)}
                    onChange={() => toggleCounty(county)}
                  />
                  <span>{county}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button className="clear-btn" onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>

      {/* Locations Count */}
      <div className="locations-header">
        <span className="locations-count">
          {filteredLocations.length} Location{filteredLocations.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Locations List */}
      <div className="locations-list">
        {filteredLocations.map((location) => (
          <button
            key={location.id}
            className="location-item"
            onClick={() => {
              selectedLocationId.set(location.id);
            }}
          >
            <img
              src={location.thumbnailUrl}
              alt={location.name}
              className="location-thumb"
            />
            <div className="location-info">
              <h3 className="location-name">{location.name}</h3>
              <p className="location-county">{location.county}</p>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .sidebar-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: var(--spacing-sm);
        }

        .filters {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid rgba(201, 169, 97, 0.3);
        }

        .dropdown {
          position: relative;
        }

        .dropdown-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(201, 169, 97, 0.4);
          border-radius: 4px;
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: var(--color-text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dropdown-toggle:hover {
          border-color: var(--color-ornament-gold);
          background: rgba(255, 255, 255, 0.7);
        }

        .dropdown-toggle.active {
          border-color: var(--color-ornament-gold);
          background: rgba(201, 169, 97, 0.1);
        }

        .dropdown-arrow {
          font-size: 0.6rem;
          color: var(--color-text-secondary);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px;
          background: var(--color-card-bg);
          border: 1px solid rgba(201, 169, 97, 0.4);
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-height: 200px;
          overflow-y: auto;
          z-index: 100;
        }

        .dropdown-menu::-webkit-scrollbar {
          width: 4px;
        }

        .dropdown-menu::-webkit-scrollbar-track {
          background: transparent;
        }

        .dropdown-menu::-webkit-scrollbar-thumb {
          background: var(--color-ornament-gold);
          border-radius: 2px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
          color: var(--color-text-primary);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .dropdown-item:hover {
          background: rgba(201, 169, 97, 0.1);
        }

        .dropdown-item input[type="checkbox"] {
          cursor: pointer;
          accent-color: var(--color-ornament-gold);
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }

        .clear-btn {
          padding: 0.4rem 0.8rem;
          background: transparent;
          border: 1px solid var(--color-ornament-gold);
          border-radius: 4px;
          color: var(--color-ornament-gold);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          align-self: flex-start;
        }

        .clear-btn:hover {
          background: var(--color-ornament-gold);
          color: white;
        }

        .locations-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .locations-count {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .locations-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overflow-y: auto;
          padding-right: 4px;
        }

        .locations-list::-webkit-scrollbar {
          width: 4px;
        }

        .locations-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .locations-list::-webkit-scrollbar-thumb {
          background: var(--color-ornament-gold);
          border-radius: 2px;
        }

        .location-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: 0;
          background: transparent;
          border: none;
          text-decoration: none;
          color: var(--color-text-primary);
          transition: opacity 0.2s ease;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: var(--font-body);
        }

        .location-item:hover {
          opacity: 0.7;
        }

        .location-thumb {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .location-info {
          flex: 1;
          min-width: 0;
        }

        .location-name {
          margin: 0 0 0.1rem 0;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.3;
        }

        .location-county {
          margin: 0;
          font-size: 0.7rem;
          color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  );
}
