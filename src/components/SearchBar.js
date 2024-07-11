import React, { useState } from 'react';
import './Player.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ searchTerm, onSearch }) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleIconClick = () => {
    onSearch(inputValue);
  };

  return (
    <div className="relative mb-4 mt-7 flex justify-between serchbox rounded-lg">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="p-3 pl-3 pr-10 text-md border-gray-300 rounded-lg serchbox text-white outline-none w-full"
        placeholder="Search Song, Artist"
      />
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
        onClick={handleIconClick}
      />
    </div>
  );
};

export default SearchBar;
