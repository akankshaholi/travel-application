import { useState, useEffect, useCallback } from 'react';
import { getWeather } from '../services/weatherService';
import WeatherCardSkeleton from './WeatherCardSkeleton';

function WeatherCard({ latitude, longitude, overrideName }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  const fetchWeather = useCallback(async () => {
    if (latitude == null || longitude == null) return;
    setLoading(true);
    setError(null);
    setImageError(false);
    try {
      const data = await getWeather(latitude, longitude);
      setWeather(data);
    } catch (err) {
      setError('Weather information is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  if (latitude == null || longitude == null) {
    return null;
  }

  if (loading) {
    return <WeatherCardSkeleton />;
  }

  if (error) {
    return (
      <div className="weather-card weather-card-error">
        <div className="weather-error-content">
          <span style={{ fontSize: '1.5rem' }}>🌤️</span>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchWeather} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const temp = Math.round(weather.temperature);
  const feelsLike = Math.round(weather.feelsLike);
  const iconUrl = weather.weatherIcon && !imageError
    ? `https://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png`
    : null;

  const displayName = overrideName || weather.locationName || 'Current Location';
  const countryStr = weather.country ? `, ${weather.country}` : '';

  const visibilityKm = weather.visibility ? (weather.visibility / 1000).toFixed(0) : null;

  return (
    <article className="weather-card" aria-label={`Weather information for ${displayName}`}>
      <div className="weather-header">
        <div className="weather-location-title">
          <span className="weather-location-icon">🌤️</span>
          <span className="weather-location-name">{displayName}{countryStr}</span>
        </div>
        <button
          className="weather-refresh-btn"
          onClick={fetchWeather}
          aria-label="Refresh weather"
          title="Refresh weather"
        >
          🔄
        </button>
      </div>

      <div className="weather-main">
        <div className="weather-icon-wrapper">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={weather.weatherDescription || weather.weatherCondition || 'Weather icon'}
              onError={() => setImageError(true)}
              className="weather-icon-img"
            />
          ) : (
            <span className="weather-icon-fallback">🌤️</span>
          )}
        </div>
        <div className="weather-temp-block">
          <div className="weather-temp">{temp}°C</div>
          <div className="weather-condition">
            {weather.weatherDescription || weather.weatherCondition}
          </div>
          <div className="weather-feels-like">
            Feels like {feelsLike}°C
          </div>
        </div>
      </div>

      <div className="weather-stats">
        <div className="weather-stat-item">
          <span className="stat-label">💧 Humidity</span>
          <span className="stat-value">{weather.humidity}%</span>
        </div>
        <div className="weather-stat-item">
          <span className="stat-label">💨 Wind</span>
          <span className="stat-value">{weather.windSpeed} m/s</span>
        </div>
        {visibilityKm && (
          <div className="weather-stat-item">
            <span className="stat-label">👁 Visibility</span>
            <span className="stat-value">{visibilityKm} km</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default WeatherCard;
