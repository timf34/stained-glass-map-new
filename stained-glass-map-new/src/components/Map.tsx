/**
 * Map Component - Interactive Mapbox GL Map
 *
 * Client-side React component (island)
 * Displays location markers and responds to filter state
 */

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useStore } from '@nanostores/react';
import { selectedArtists, selectedCounties } from '../stores/filters';

interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
  county: string;
  artists: string[]; // Array of artist slugs
}

interface MapProps {
  locations: Location[];
  mapboxToken: string;
  onMarkerClick?: (locationId: string) => void;
}

export default function Map({ locations, mapboxToken, onMarkerClick }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Subscribe to filter state
  const activeArtists = useStore(selectedArtists);
  const activeCounties = useStore(selectedCounties);

  console.log('Map component rendering with', locations.length, 'locations');
  console.log('Active filters - Artists:', activeArtists, 'Counties:', activeCounties);

  // Filter locations based on active filters
  const filteredLocations = locations.filter((location) => {
    // Artist filter (if any artists selected, location must have at least one matching artist)
    const matchesArtist =
      activeArtists.length === 0 ||
      location.artists.some((artist) => activeArtists.includes(artist));

    // County filter (if any counties selected, location must match)
    const matchesCounty =
      activeCounties.length === 0 ||
      activeCounties.includes(location.county);

    return matchesArtist && matchesCounty;
  });

  console.log('Filtered down to', filteredLocations.length, 'locations');

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('Initializing map with token:', mapboxToken?.substring(0, 10) + '...');
    mapboxgl.accessToken = mapboxToken;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/timf34/clzefs8u900ce01qt78dxdwpv', // Your custom style
      center: [-7.6921, 53.1424], // Ireland center
      zoom: 6,
    });

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Error handling
    mapInstance.on('error', (e) => {
      console.error('Map error:', e);
    });

    // Wait for map to load before setting the ref
    mapInstance.on('load', () => {
      console.log('Map loaded successfully');
      map.current = mapInstance;
      setMapLoaded(true);
    });

    return () => {
      mapInstance.remove();
    };
  }, [mapboxToken]);

  // Update markers when filtered locations change
  useEffect(() => {
    if (!map.current || !mapLoaded) {
      console.log('Map not ready yet, skipping marker creation');
      return;
    }

    console.log('Creating markers for', filteredLocations.length, 'locations');

    // Remove existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers for filtered locations
    filteredLocations.forEach((location) => {
      console.log('Creating marker for', location.name, 'at', location.coordinates);

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `
        <div style="font-family: var(--font-body); padding: 0.5rem;">
          <h3 style="margin: 0 0 0.25rem 0; font-size: 1rem; color: #2C2416;">
            ${location.name}
          </h3>
          <p style="margin: 0; font-size: 0.85rem; color: #666;">
            ${location.county}
          </p>
          <button
            onclick="window.openLocationModal && window.openLocationModal('${location.id}')"
            style="
              display: inline-block;
              margin-top: 0.5rem;
              padding: 0.25rem 0.5rem;
              background: #C9A961;
              color: white;
              border: none;
              border-radius: 3px;
              font-size: 0.85rem;
              font-weight: 500;
              cursor: pointer;
            "
          >
            View Details →
          </button>
        </div>
        `
      );

      // Use native Mapbox marker (no drift on zoom)
      const marker = new mapboxgl.Marker({
        color: '#74b6c4', // Match old site color
      })
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler to open modal
      marker.getElement().addEventListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(location.id);
        }
      });

      markers.current.push(marker);
    });

    console.log('Total markers created:', markers.current.length);
  }, [filteredLocations, onMarkerClick, mapLoaded]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}
