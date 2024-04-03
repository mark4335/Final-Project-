// Search.js
import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleCancel = () => {
    setSearchText('');
    onSearch('');
  };

  return (
    <div className='Search'>
      <input
        type="text"
        placeholder="Search books..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default Search;
