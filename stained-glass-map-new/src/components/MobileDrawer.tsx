import '../styles/MobileDrawer.css';
/**
 * Mobile Bottom Drawer Component
 *
 * Swipeable bottom drawer for mobile devices containing filters and location list.
 * Mimics native pull-up sheet behavior.
 */

import { useState, useRef, useEffect } from 'react';
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

interface MobileDrawerProps {
  locations: Location[];
  artists: Artist[];
  counties: string[];
}

const DRAWER_PEEK = 60; // Height of visible peek when closed


export default function MobileDrawer({ locations, artists, counties }: MobileDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [artistDropdownOpen, setArtistDropdownOpen] = useState(false);
  const [countyDropdownOpen, setCountyDropdownOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const activeArtists = useStore(selectedArtists);
  const activeCounties = useStore(selectedCounties);

  // Filter locations based on active filters
  const filteredLocations = locations.filter((loc) => {
    const artistMatch = activeArtists.length === 0 ||
      loc.artists.some(a => activeArtists.includes(a));
    const countyMatch = activeCounties.length === 0 ||
      activeCounties.includes(loc.county);
    return artistMatch && countyMatch;
  });

  const toggleArtist = (slug: string) => {
    const current = selectedArtists.get();
    if (current.includes(slug)) {
      selectedArtists.set(current.filter(a => a !== slug));
    } else {
      selectedArtists.set([...current, slug]);
    }
  };

  const toggleCounty = (county: string) => {
    const current = selectedCounties.get();
    if (current.includes(county)) {
      selectedCounties.set(current.filter(c => c !== county));
    } else {
      selectedCounties.set([...current, county]);
    }
  };

  const clearFilters = () => {
    selectedArtists.set([]);
    selectedCounties.set([]);
  };

  const handleLocationClick = (locationId: string) => {
    selectedLocationId.set(locationId);
    setIsExpanded(false);
  };

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

  // Touch handlers for swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentY.current = e.touches[0].clientY;
    const delta = startY.current - currentY.current;
    setDragOffset(delta);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const delta = startY.current - currentY.current;
    const threshold = 50;

    if (delta > threshold && !isExpanded) {
      setIsExpanded(true);
    } else if (delta < -threshold && isExpanded) {
      setIsExpanded(false);
    }

    setDragOffset(0);
  };

  // Mouse handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    startY.current = e.clientY;
    currentY.current = e.clientY;
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      currentY.current = e.clientY;
      const delta = startY.current - currentY.current;
      setDragOffset(delta);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);

      const delta = startY.current - currentY.current;
      const threshold = 50;

      if (delta > threshold && !isExpanded) {
        setIsExpanded(true);
      } else if (delta < -threshold && isExpanded) {
        setIsExpanded(false);
      }

      setDragOffset(0);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isExpanded]);

  const hasActiveFilters = activeArtists.length > 0 || activeCounties.length > 0;

  return (
    <>
      <div
        ref={drawerRef}
        className={`mobile-drawer ${isExpanded ? 'expanded' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{
          transform: isDragging
            ? `translateY(calc(${isExpanded ? '0%' : '100%'} - ${isExpanded ? dragOffset : DRAWER_PEEK + dragOffset}px))`
            : undefined
        }}
      >
        {/* Celtic corner accents */}
        <img
          src="/HighQualityCelticCornerDesign.svg"
          alt=""
          className="drawer-celtic-left"
          aria-hidden="true"
        />
        <img
          src="/HighQualityCelticCornerDesign.svg"
          alt=""
          className="drawer-celtic-right"
          aria-hidden="true"
        />

        {/* Pull handle */}
        <div
          className="drawer-handle"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="handle-bar" />
          <div className="handle-label">
            <span className="location-count">{filteredLocations.length} Location{filteredLocations.length === 1 ? '' : 's'}</span>
            {hasActiveFilters && <span className="filter-indicator" />}
          </div>
        </div>

        {/* Drawer content */}
        <div className="drawer-content">
          {/* Filters */}
          <div className="drawer-filters">
            <div className="filter-row">
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
          </div>

          {/* Locations list */}
          <div className="drawer-locations">
            {filteredLocations.map((loc) => (
              <button
                key={loc.id}
                className="location-item"
                onClick={() => handleLocationClick(loc.id)}
              >
                <img
                  src={loc.thumbnailUrl}
                  alt={loc.name}
                  className="location-thumb"
                  loading="lazy"
                />
                <div className="location-info">
                  <h3 className="location-name">{loc.name}</h3>
                  <p className="location-county">{loc.county}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>


    </>
  );
}
