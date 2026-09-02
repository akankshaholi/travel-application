import { useState, useEffect } from 'react';
import { getDestinations, searchDestinations, filterDestinations } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import DestinationCardSkeleton from '../components/DestinationCardSkeleton';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      
      // If there's a search query, prioritize the search API
      if (debouncedQuery.trim()) {
        data = await searchDestinations(debouncedQuery);
        // Apply category/continent filters locally if they exist
        if (selectedContinent !== 'All') {
          data = data.filter(d => d.continent.toLowerCase() === selectedContinent.toLowerCase());
        }
        if (selectedCategory !== 'All') {
          data = data.filter(d => d.category.toLowerCase().includes(selectedCategory.toLowerCase()));
        }
      } 
      // If no search query but filters exist, use filter API
      else if (selectedContinent !== 'All' || selectedCategory !== 'All') {
        data = await filterDestinations(selectedContinent, selectedCategory);
      } 
      // Base case: get all
      else {
        data = await getDestinations();
      }

      setDestinations(data);
    } catch (err) {
      setError('Unable to load destinations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, [debouncedQuery, selectedContinent, selectedCategory]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedContinent('All');
    setSelectedCategory('All');
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Explore the World</h1>
        <p className="page-subtitle">Discover incredible destinations and find your next adventure.</p>
      </div>

      <div className="controls-container">
        <SearchBar 
          query={searchQuery} 
          onQueryChange={setSearchQuery} 
          onClear={() => setSearchQuery('')} 
        />
        <FilterBar 
          selectedContinent={selectedContinent}
          onContinentChange={setSelectedContinent}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {loading && (
        <div className="destinations-grid">
          {[...Array(8)].map((_, i) => <DestinationCardSkeleton key={i} />)}
        </div>
      )}

      {!loading && error && (
        <div className="state-container">
          <h2 className="state-title text-red-500">Oops!</h2>
          <p className="state-desc">{error}</p>
          <button className="btn btn-primary" onClick={loadDestinations}>Try Again</button>
        </div>
      )}

      {!loading && !error && destinations.length === 0 && (
        <div className="state-container">
          <h2 className="state-title">No destinations found.</h2>
          <p className="state-desc">Try a different destination, country, or filter.</p>
          <button className="btn btn-outline" onClick={handleClearFilters}>Clear Filters</button>
        </div>
      )}

      {!loading && !error && destinations.length > 0 && (
        <div className="destinations-grid">
          {destinations.map(dest => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Destinations;
