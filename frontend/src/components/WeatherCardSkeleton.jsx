function WeatherCardSkeleton() {
  return (
    <div className="weather-card weather-card-skeleton" aria-label="Loading weather information">
      <div className="weather-header">
        <div className="skeleton skeleton-text" style={{ width: '40%', height: '1.2rem' }}></div>
        <div className="skeleton" style={{ width: '2rem', height: '2rem', borderRadius: '50%' }}></div>
      </div>

      <div className="weather-main">
        <div className="skeleton" style={{ width: '4rem', height: '4rem', borderRadius: '50%' }}></div>
        <div>
          <div className="skeleton skeleton-text" style={{ width: '5rem', height: '2.5rem', marginBottom: '0.25rem' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '7rem', height: '1rem' }}></div>
        </div>
      </div>

      <div className="weather-stats">
        <div className="skeleton skeleton-text" style={{ width: '30%', height: '1rem' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '30%', height: '1rem' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '30%', height: '1rem' }}></div>
      </div>
    </div>
  );
}

export default WeatherCardSkeleton;
