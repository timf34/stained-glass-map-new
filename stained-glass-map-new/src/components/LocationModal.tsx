import '../styles/LocationModal.css';
import { useEffect, useRef, useState } from 'react';
import PhotoCredit from './PhotoCredit';
import type { Photo } from './PhotoCredit';

interface Window {
  title: string;
  artist: string | null;
  year: number | null;
  description: string | null;
  images: Photo[];
}
interface LocationData {
  name: string;
  address: string | null;
  county: string;
  description: string | null;
  google_maps_link: string | null;
  visit_note?: string;
  sources?: Array<{ label: string; url: string }>;
  windows: Window[];
}
interface Props {
  location: LocationData | null;
  artistNames: Record<string, string>;
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationModal({ location, artistNames, isOpen, onClose }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const lightbox = useRef<HTMLDivElement>(null);
  const gallery = location?.windows.flatMap(window => window.images.map(photo => ({ window, photo }))) ?? [];
  const current = selected === null ? null : gallery[selected];
  const navigate = (step: number) => setSelected(index => index === null ? null : (index + step + gallery.length) % gallery.length);

  useEffect(() => { setSelected(null); }, [location?.name, isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    return () => previous?.focus();
  }, [isOpen]);
  useEffect(() => {
    if (selected !== null) lightbox.current?.focus();
  }, [selected]);
  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); selected === null ? onClose() : closeImage(); }
      if (selected !== null && event.key === 'ArrowRight') { event.preventDefault(); navigate(1); }
      if (selected !== null && event.key === 'ArrowLeft') { event.preventDefault(); navigate(-1); }
      if (event.key === 'Tab') {
        const root = selected === null ? dialog.current : lightbox.current;
        const elements = root?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]');
        if (!elements?.length) return;
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === root)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === root)) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, selected, gallery.length, onClose]);
  function closeImage() { setSelected(null); dialog.current?.focus(); }
  if (!isOpen || !location) return null;

  return <>
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-label={location.name} onClick={event => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close location">×</button>
        <div className="modal-header">
          <p className="modal-county">{location.county}</p>
          <h2 className="modal-title">{location.name}</h2>
          {location.address && <p className="modal-address">{location.address}</p>}
        </div>
        {location.description && <div className="modal-description"><p>{location.description}</p></div>}
        <div className="windows-section">
          <div className="section-header"><div className="section-line"/><h3 className="section-title">Stained Glass Windows</h3><div className="section-line"/></div>
          <div className="windows-grid">
            {location.windows.map((window, index) => {
              const start = location.windows.slice(0, index).reduce((count, item) => count + item.images.length, 0);
              return <article className="window-card" key={index}>
                {window.images[0] && <button className="window-image-button" onClick={() => setSelected(start)} aria-label={`Enlarge ${window.title}`}>
                  <img src={window.images[0].url} alt={window.images[0].alt || window.title} className="window-image" loading="lazy"/>
                  <span className="image-hint">View {window.images.length > 1 ? `${window.images.length} photographs` : 'photograph'} ↗</span>
                </button>}
                <div className="window-info">
                  <h4 className="window-title">{window.title}</h4>
                  {window.artist && <a href={`/artists/${window.artist}`} className="window-artist-link">{artistNames[window.artist] || window.artist}</a>}
                  {window.year && <p className="window-year">{window.year}</p>}
                  {window.description && !/^\s*(TBC|https?:\/\/)/i.test(window.description) && <p className="window-description">{window.description}</p>}
                  <PhotoCredit photo={window.images[0]}/>
                </div>
              </article>;
            })}
          </div>
        </div>
        {location.visit_note && <p className="visit-note">{location.visit_note}</p>}
        {location.sources?.length ? <details className="location-sources"><summary>Sources & further reading</summary><ul>{location.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></li>)}</ul></details> : null}
        {location.google_maps_link && <div className="modal-footer"><a className="maps-link" href={location.google_maps_link.trim()} target="_blank" rel="noopener noreferrer">Get directions ↗</a></div>}
      </div>
    </div>
    {current && <div className="lightbox" ref={lightbox} tabIndex={-1} role="dialog" aria-modal="true" aria-label={current.window.title} onClick={closeImage}>
      <button className="lightbox-close" onClick={closeImage} aria-label="Close photograph">×</button>
      {gallery.length > 1 && <>
        <button className="lightbox-nav lightbox-prev" aria-label="Previous photograph" onClick={event => { event.stopPropagation(); navigate(-1); }}>‹</button>
        <button className="lightbox-nav lightbox-next" aria-label="Next photograph" onClick={event => { event.stopPropagation(); navigate(1); }}>›</button>
      </>}
      <div className="lightbox-content" onClick={event => event.stopPropagation()}>
        <img src={current.photo.url} alt={current.photo.alt || current.window.title} className="lightbox-image"/>
        <div className="lightbox-caption"><h4>{current.window.title}</h4><PhotoCredit photo={current.photo}/>
          {current.photo.original_url && <a className="original-photo" href={current.photo.original_url} target="_blank" rel="noopener noreferrer">Open full-resolution original ↗</a>}
          <p className="lightbox-counter">{selected! + 1} / {gallery.length}</p>
        </div>
      </div>
    </div>}
  </>;
}
