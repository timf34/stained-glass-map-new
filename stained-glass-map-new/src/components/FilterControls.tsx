import '../styles/FilterControls.css';
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


    </div>
  );
}
