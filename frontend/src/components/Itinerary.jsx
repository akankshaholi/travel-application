function Itinerary({ itineraryData, onRegenerate }) {
  if (!itineraryData) return null;

  const getTimeIcon = (timeStr) => {
    const t = (timeStr || '').toLowerCase();
    if (t.includes('morning')) return '🌅';
    if (t.includes('afternoon')) return '☀️';
    if (t.includes('evening') || t.includes('night')) return '🌙';
    return '⏱️';
  };

  return (
    <div className="itinerary-container" role="region" aria-label="Generated Travel Itinerary">
      {/* Header Banner */}
      <div className="itinerary-header">
        <div className="itinerary-dest-title">
          ✈️ {itineraryData.destination.toUpperCase()} — {itineraryData.days} DAY{itineraryData.days > 1 ? 'S' : ''}
        </div>
        {itineraryData.summary && (
          <p className="itinerary-summary">{itineraryData.summary}</p>
        )}
      </div>

      {/* Days Timeline */}
      <div className="itinerary-days">
        {itineraryData.itinerary && itineraryData.itinerary.map((dayItem) => (
          <div key={dayItem.day} className="itinerary-day-card">
            <div className="day-header">
              <span className="day-number-badge">DAY {dayItem.day}</span>
              <h3 className="day-title">{dayItem.title || `Day ${dayItem.day}`}</h3>
            </div>

            <div className="day-activities">
              {dayItem.activities && dayItem.activities.map((act, actIdx) => (
                <div key={actIdx} className="activity-item">
                  <div className="activity-time-badge">
                    <span>{getTimeIcon(act.time)}</span>
                    <span>{act.time}</span>
                  </div>
                  <div className="activity-details">
                    <h4 className="activity-title">{act.title}</h4>
                    <p className="activity-desc">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Regenerate Action */}
      {onRegenerate && (
        <div className="itinerary-footer">
          <button className="btn btn-primary" onClick={onRegenerate}>
            🔄 Regenerate Itinerary
          </button>
        </div>
      )}
    </div>
  );
}

export default Itinerary;
