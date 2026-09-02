import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDestinationImage } from '../services/imageService';

function DestinationCard({ destination }) {
  const [imageObj, setImageObj] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setImageLoading(true);
    setImageError(false);

    getDestinationImage(destination)
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
  }, [destination]);

  const hasImage = imageObj && imageObj.imageUrl && !imageError;

  return (
    <article className="destination-card">
      <div className="card-image-container">
        {imageLoading && (
          <div className="skeleton skeleton-img" style={{ height: '100%' }}></div>
        )}

        {!imageLoading && hasImage && (
          <img
            src={imageObj.imageUrl}
            alt={imageObj.altText || `${destination.name}, ${destination.country}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="card-img"
          />
        )}

        {(!imageLoading && !hasImage) && (
          <div className="card-image-fallback">
            <span className="fallback-icon">🌍</span>
            <span className="fallback-text">{destination.name}</span>
            <span className="fallback-sub">Image unavailable</span>
          </div>
        )}

        <div className="card-badge">{destination.category}</div>
      </div>

      <div className="card-content">
        <div className="card-location">
          {destination.continent} &bull; {destination.country}
        </div>
        <h3 className="card-title">{destination.name}</h3>
        <p className="card-desc">{destination.shortDescription}</p>

        <div className="card-footer">
          <span className="popularity">⭐ {destination.popularity}/100</span>
          <Link
            to={`/destination/${destination.id}`}
            className="btn btn-primary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
          >
            Explore
          </Link>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;
