# Stained Glass Map - Project Documentation

## Overview

**StainedGlassMap.com** is an interactive map for discovering Irish stained glass art. Users can explore locations across Ireland, view windows by various artists, and learn about the masters of Irish stained glass.

## Tech Stack

- **Framework:** Astro 4.16 with React islands
- **Map:** Mapbox GL JS v3
- **State Management:** Nanostores (lightweight, framework-agnostic)
- **Data:** YAML content collections (no database)
- **Styling:** Custom CSS with Celtic/parchment aesthetic
- **Language:** TypeScript

## Project Structure

```
stained-glass-map-new/
├── src/
│   ├── content/
│   │   ├── config.ts           # Content collection schemas
│   │   ├── artists/            # Artist YAML files (4 artists)
│   │   │   ├── harry-clarke.yaml
│   │   │   ├── evie-hone.yaml
│   │   │   ├── peadar-lamb.yaml
│   │   │   └── thomas-denny.yaml
│   │   └── locations/          # Location YAML files (18 locations)
│   │       ├── hugh-lane-gallery.yaml
│   │       ├── the-honan-chapel.yaml
│   │       └── ... (16 more)
│   ├── components/
│   │   ├── Map.tsx              # Mapbox GL map with custom markers
│   │   ├── MapWithModal.tsx     # Map + modal wrapper with shared state
│   │   ├── LocationModal.tsx    # Modal for viewing location details & images
│   │   ├── Sidebar.tsx          # Desktop sidebar with filters & locations list
│   │   ├── MobileDrawer.tsx     # Mobile swipeable bottom drawer
│   │   ├── FilterControls.tsx   # Artist/county filter dropdowns
│   │   ├── ArtistWorksGrid.tsx  # Works grid with modal on artist pages
│   │   ├── CelticHeader.astro   # Header with navigation
│   │   └── FeaturedSidebar.astro # (Legacy) Featured locations sidebar
│   ├── pages/
│   │   ├── index.astro          # Homepage with map
│   │   ├── about.astro          # About page
│   │   └── artists/
│   │       ├── index.astro      # Artists listing page
│   │       └── [slug].astro     # Individual artist pages
│   ├── layouts/
│   │   └── BaseLayout.astro     # Base HTML layout with global styles
│   ├── stores/
│   │   ├── filters.ts           # Filter state (selectedArtists, selectedCounties)
│   │   └── mapStore.ts          # Map state (selectedLocationId)
│   └── styles/
│       └── global.css           # Global CSS with design tokens
├── public/
│   └── images/                  # Static images
└── package.json
```

## Data Schemas

### Location (`src/content/locations/*.yaml`)

```yaml
name: Hugh Lane Gallery
coordinates:
  - 53.3541770777581    # latitude
  - -6.26466423213288   # longitude
address: Charlemont House, Parnell Square N, Dublin 1
county: Dublin
google_maps_link: https://maps.app.goo.gl/...
description: null
windows:
  - title: '"Mr Gilhooley" for the Geneva Window'
    artist: harry-clarke   # slug reference to artist
    year: 1929
    description: TBC
    images:
      - url: https://i.imgur.com/GdzHYPQ.jpeg
        alt: Description of image
```

### Artist (`src/content/artists/*.yaml`)

```yaml
name: Harry Clarke
slug: harry-clarke
birth_year: 1889
death_year: 1931
biography: Biography text here (can be multi-line with |)
portrait_url: /images/artists/harry-clarke.jpg  # optional
```

## Key Components

### Map.tsx
Renders the Mapbox GL map with custom gold markers. Filters locations based on selected artists/counties from nanostores.

### MapWithModal.tsx
Wraps Map and LocationModal with shared state. Also reads `?location=xxx` query parameter to auto-open modals (for deep linking from artist pages).

### LocationModal.tsx
Displays location details with:
- Window gallery with thumbnails
- Full-screen lightbox with navigation
- Artist names linked to artist pages
- Google Maps link

### Sidebar.tsx (Desktop)
Left sidebar showing:
- Filter controls (artist/county dropdowns)
- Filtered locations list
- Click to open location modal

### MobileDrawer.tsx
Swipeable bottom drawer for mobile with:
- Touch/mouse gesture support
- Filter controls
- Locations list
- Celtic corner ornaments

### ArtistWorksGrid.tsx
Used on artist pages to display works. Clicking a work opens the LocationModal directly on the page (no navigation).

## State Management

Uses **nanostores** for lightweight state sharing between React components:

```typescript
// filters.ts
selectedArtists: atom<string[]>([])    // Selected artist slugs
selectedCounties: atom<string[]>([])   // Selected county names

// mapStore.ts
selectedLocationId: atom<string | null>(null)  // For opening modals
```

## Styling

### Design Tokens (global.css)

```css
--color-parchment: #f5f0e6        /* Background */
--color-ornament-gold: #c9a961    /* Primary accent */
--color-accent-brown: #8b6914     /* Hover states */
--color-text-primary: #2c1810     /* Main text */
--font-heading: 'Cinzel', serif   /* Headings */
--font-body: 'Cormorant Garamond' /* Body text */
```

### Celtic Aesthetic
- Corner ornaments on map and drawers
- Gold borders and accents
- Parchment-colored backgrounds
- Serif typography

## Running the Project

```bash
cd stained-glass-map-new
npm install
npm run dev        # Start dev server at http://localhost:4321
npm run build      # Production build
npm run preview    # Preview production build
```

## Environment Variables

Create a `.env` file or set in your environment:

```
PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

The Mapbox token is passed from `index.astro` to Map components.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with interactive map |
| `/about` | About page with project info |
| `/artists` | Artists listing grid |
| `/artists/[slug]` | Individual artist page with bio and works |

## Adding Content

### Add a New Location

1. Create `src/content/locations/location-name.yaml`
2. Follow the location schema above
3. Reference existing artist slugs or leave `artist: null`

### Add a New Artist

1. Create `src/content/artists/artist-name.yaml`
2. Follow the artist schema above
3. Use the slug consistently when referencing in locations

## Future Improvements

- [ ] Write detailed biographies for key artists (Harry Clarke, Evie Hone, etc.)
- [ ] Add artist portrait images to `public/images/artists/`
- [ ] Add more artists: Michael Healy, Sarah Purser, Wilhelmina Geddes
- [ ] Implement crowdsourcing mechanism for user submissions
- [ ] Connect "Add a Location" button to actual form

## Notes

- Images are currently hosted on Imgur
- The project uses Astro's content collections for type-safe YAML data
- React components use `client:load` directive for hydration
- Mobile layout switches at 768px breakpoint
