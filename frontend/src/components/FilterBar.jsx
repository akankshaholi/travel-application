function FilterBar({ 
  selectedContinent, 
  onContinentChange, 
  selectedCategory, 
  onCategoryChange 
}) {
  const continents = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Australia'];
  const categories = ['All', 'Beach', 'Beach & Nature', 'Culture', 'Culture & History', 'Culture & City', 'Culture & Nightlife', 'Art & Beach', 'Adventure', 'Nature', 'Nature & City', 'Nature & Adventure', 'Luxury', 'Luxury & City', 'City & Culture', 'City & Beach'];

  return (
    <div className="filters-row">
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="filter-group">
          <label className="filter-label">Continent:</label>
          <select 
            className="filter-select"
            value={selectedContinent} 
            onChange={(e) => onContinentChange(e.target.value)}
          >
            {continents.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category:</label>
          <select 
            className="filter-select"
            value={selectedCategory} 
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
