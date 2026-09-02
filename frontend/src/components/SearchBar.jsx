function SearchBar({ query, onQueryChange, onClear }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search destinations or countries..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      {query && (
        <button className="clear-search-btn" onClick={onClear} aria-label="Clear search">
          &times;
        </button>
      )}
    </div>
  );
}

export default SearchBar;
