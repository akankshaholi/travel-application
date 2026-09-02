function DestinationCardSkeleton() {
  return (
    <div className="destination-card">
      <div className="skeleton skeleton-img"></div>
      <div className="card-content">
        <div className="skeleton skeleton-text short"></div>
        <div className="skeleton skeleton-text title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="card-footer" style={{ marginTop: '1rem' }}>
          <div className="skeleton skeleton-text" style={{ width: '50px', margin: 0 }}></div>
          <div className="skeleton skeleton-btn"></div>
        </div>
      </div>
    </div>
  );
}

export default DestinationCardSkeleton;
