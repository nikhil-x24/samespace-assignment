import React from 'react';
import "./Player.css";

const SongItem = ({ song, onClick, isActive, totalDuration }) => {
  return (
    <li 
      className={`flex items-center p-4 cursor-pointer rounded-md ${isActive ? 'custom-css-SongItem' : ''} hover:custom-css-SongItem`}
      onClick={() => onClick(song)} // Ensure onClick handler is correctly passed
    >
      <div className="w-12 h-12 mr-4">
        <img 
          src={`https://cms.samespace.com/assets/${song.cover}`} 
          alt={song.title} 
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white">{song.name}</h3>
        <p className="text-gray-400">{song.artist}</p>
      </div>
      <div className="text-gray-400 ">
        {song.date_updated.slice(11, 16)}
      </div>
    </li>
  );
};

export default SongItem;


