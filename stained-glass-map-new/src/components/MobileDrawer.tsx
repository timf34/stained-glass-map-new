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
const DRAWER_EXPANDED_HEIGHT = 70; // Percentage of screen when expanded

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
            <span className="location-count">{filteredLocations.length} Locations</span>
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

      <style>{`
        .mobile-drawer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: ${DRAWER_EXPANDED_HEIGHT}vh;
          background: rgba(245, 239, 230, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          border-top: 1px solid rgba(201, 169, 97, 0.3);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
          transform: translateY(calc(100% - ${DRAWER_PEEK}px));
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 500;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Celtic corner accents */
        .drawer-celtic-left,
        .drawer-celtic-right {
          position: absolute;
          top: -8px;
          width: 50px;
          height: 50px;
          opacity: 0.5;
          pointer-events: none;
          z-index: 10;
        }

        .drawer-celtic-left {
          left: 8px;
          transform: rotate(180deg);
        }

        .drawer-celtic-right {
          right: 8px;
          transform: rotate(-90deg);
        }

        .mobile-drawer.expanded {
          transform: translateY(0);
        }

        .mobile-drawer.dragging {
          transition: none;
        }

        .drawer-handle {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 16px 8px;
          cursor: grab;
          user-select: none;
          flex-shrink: 0;
        }

        .drawer-handle:active {
          cursor: grabbing;
        }

        .handle-bar {
          width: 40px;
          height: 4px;
          background: var(--color-ornament-gold);
          opacity: 0.6;
          border-radius: 2px;
          margin-bottom: 8px;
        }

        .handle-label {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .location-count {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .filter-indicator {
          width: 8px;
          height: 8px;
          background: var(--color-ornament-gold);
          border-radius: 50%;
        }

        .drawer-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 0 16px 16px;
        }

        .drawer-filters {
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(201, 169, 97, 0.2);
          margin-bottom: 12px;
          flex-shrink: 0;
        }

        .filter-row {
          display: flex;
          gap: 8px;
          align-items: stretch;
        }

        .dropdown {
          position: relative;
          flex: 1;
        }

        .dropdown-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: transparent;
          border: 1px solid rgba(201, 169, 97, 0.4);
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: var(--color-text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dropdown-toggle:hover,
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
          bottom: 100%;
          left: 0;
          right: 0;
          margin-bottom: 4px;
          background: white;
          border: 1px solid rgba(201, 169, 97, 0.4);
          border-radius: 8px;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
          max-height: 200px;
          overflow-y: auto;
          z-index: 100;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          font-size: 0.9rem;
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
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .clear-btn {
          padding: 10px 16px;
          background: transparent;
          border: 1px solid rgba(201, 169, 97, 0.4);
          border-radius: 8px;
          color: var(--color-ornament-gold);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .clear-btn:hover {
          background: var(--color-ornament-gold);
          color: white;
        }

        .drawer-locations {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-right: 4px;
        }

        .drawer-locations::-webkit-scrollbar {
          width: 4px;
        }

        .drawer-locations::-webkit-scrollbar-track {
          background: transparent;
        }

        .drawer-locations::-webkit-scrollbar-thumb {
          background: var(--color-ornament-gold);
          border-radius: 2px;
        }

        .location-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(201, 169, 97, 0.15);
          border-radius: 0;
          text-align: left;
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.2s ease;
        }

        .location-item:hover {
          background: rgba(201, 169, 97, 0.08);
        }

        .location-item:active {
          transform: scale(0.98);
          background: rgba(201, 169, 97, 0.15);
        }

        .location-thumb {
          width: 56px;
          height: 56px;
          object-fit: cover;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .location-info {
          flex: 1;
          min-width: 0;
        }

        .location-name {
          margin: 0 0 2px 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .location-county {
          margin: 0;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }
      `}</style>
    </>
  );
}
