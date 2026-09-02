import { useState, useEffect } from 'react';
import { getPlaceImage } from '../services/imageService';

function PlaceCard({ place, destinationName, country }) {
  const [imageObj, setImageObj] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setImageLoading(true);
    setImageError(false);

    getPlaceImage(place, destinationName, country)
      .then((data) => {
        if (isMounted) {
          if (data && data.imageUrl) {
            setImageObj(data);
          } else {
            setImageError(true);
          }
          setImageLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setImageError(true);
          setImageLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [place, destinationName, country]);

  const hasImage = imageObj && imageObj.imageUrl && !imageError;

  return (
    <article className="place-card">
      <div className="place-card-image">
        {imageLoading && (
          <div className="skeleton skeleton-img" style={{ height: '100%', width: '100%' }}></div>
        )}

        {!imageLoading && hasImage && (
          <img
            src={imageObj.imageUrl}
            alt={imageObj.altText || `${place.name} in ${destinationName || ''}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="place-img"
          />
        )}

        {(!imageLoading && !hasImage) && (
          <div className="place-card-image-fallback">
            <span className="place-fallback-icon">📍</span>
            <span className="place-fallback-text">{place.name}</span>
          </div>
        )}

        <span className="place-card-badge">{place.category || 'Attraction'}</span>
      </div>

      <div className="place-card-body">
        <h3 className="place-card-title">{place.name}</h3>
        <p className="place-card-desc">{place.description}</p>

        <div className="place-card-meta">
          {place.location && (
            <div className="place-card-meta-item">
              <span>📍</span>
              <span>{place.location}</span>
            </div>
          )}
          {place.recommendedDuration && (
            <div className="place-card-meta-item">
              <span>🕐</span>
              <span>{place.recommendedDuration}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default PlaceCard;
