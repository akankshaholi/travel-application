function PlaceCardSkeleton() {
  return (
    <div className="place-card-skeleton">
      <div className="skeleton place-skeleton-img"></div>
      <div className="place-skeleton-body">
        <div className="skeleton skeleton-text title" style={{ width: '65%', height: '1.2rem', borderRadius: '4px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '100%', height: '0.875rem', borderRadius: '4px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '85%', height: '0.875rem', borderRadius: '4px' }}></div>
        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div className="skeleton skeleton-text short" style={{ width: '50%', height: '0.8rem', borderRadius: '4px' }}></div>
          <div className="skeleton skeleton-text short" style={{ width: '40%', height: '0.8rem', borderRadius: '4px' }}></div>
        </div>
      </div>
    </div>
  );
}

export default PlaceCardSkeleton;
