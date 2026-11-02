import '../styles/Sidebar.css';
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
        {filteredLocations.length === 0 && <p className="empty-state">No locations match these filters. Try a different artist or county.</p>}
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
              loading="lazy"
            />
            <div className="location-info">
              <h3 className="location-name">{location.name}</h3>
              <p className="location-county">{location.county}</p>
            </div>
          </button>
        ))}
      </div>

      <a className="credits-link" href="/credits">Photograph credits & licences ↗</a>
    </div>
  );
}
