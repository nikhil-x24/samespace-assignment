import React from 'react';
import SongItem from './SongItem';
import "./Player.css";

const SongList = ({ songs, setCurrentSong, currentSong }) => {
  if (!songs || songs.length === 0) {
    return <p>No songs available</p>;
  }

  return (
    <ul className="song-list">
      {songs.map((song) => (
        <SongItem
          key={song.id}
          song={song}
          onClick={setCurrentSong}
          isActive={currentSong && currentSong.id === song.id}
          totalDuration={song.totalDuration}
        />
      ))}
    </ul>
  );
};

export default SongList;


