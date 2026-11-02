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


  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/timf34/clzefs8u900ce01qt78dxdwpv', // Your custom style
      center: [-7.6921, 53.1424], // Ireland center
      zoom: 6,
      bounds: new mapboxgl.LngLatBounds([-10.8, 51.3], [-5.4, 55.5]),
      fitBoundsOptions: { padding: 30 },
    });

    map.current = mapInstance;

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Error handling
    mapInstance.on('error', (e) => {
      console.error('Map error:', e);
    });

    const resizeObserver = new ResizeObserver(() => mapInstance.resize());
    resizeObserver.observe(mapContainer.current);

    // Mark the map ready for markers
    mapInstance.on('load', () => {
      map.current = mapInstance;
      setMapLoaded(true);
    });

    return () => {
      resizeObserver.disconnect();
      mapInstance.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  // Update markers when filtered locations change
  useEffect(() => {
    if (!map.current || !mapLoaded) {
      return;
    }


    // Remove existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers for filtered locations
    filteredLocations.forEach((location) => {

      // Use native Mapbox marker (no drift on zoom)
      const marker = new mapboxgl.Marker({
        color: '#74b6c4', // Match old site color
      })
        .setLngLat(location.coordinates)
        .addTo(map.current!);

      // Add click handler to open modal
      marker.getElement().setAttribute('aria-label', `View ${location.name}`);
      marker.getElement().setAttribute('role', 'button');
      marker.getElement().tabIndex = 0;
      marker.getElement().addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onMarkerClick?.(location.id);
        }
      });
      marker.getElement().addEventListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(location.id);
        }
      });

      markers.current.push(marker);
    });

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
