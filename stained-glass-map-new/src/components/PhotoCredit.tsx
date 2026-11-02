export interface Photo {
  url: string;
  alt?: string;
  caption?: string;
  credit?: string;
  license?: string;
  license_url?: string;
  source_url?: string;
  original_url?: string;
}

export default function PhotoCredit({ photo }: { photo?: Photo }) {
  if (!photo?.credit) return null;
  return <p className="photo-credit" onClick={(event) => event.stopPropagation()}>
    Photo: <a href={photo.source_url} target="_blank" rel="noopener noreferrer">{photo.credit}</a>
    {' · '}<a href={photo.license_url} target="_blank" rel="noopener noreferrer">{photo.license}</a>
    {photo.caption && <span className="photo-caption">{photo.caption}</span>}
  </p>;
}
