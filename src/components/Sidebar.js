import React, { useState, useEffect, useRef } from 'react';
import { fetchSongs } from '../api/songs'; // Adjust import path based on your project
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import SongList from './SongList';
import './Player.css'; // Import your CSS file
import { IoVolumeMedium } from "react-icons/io5";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";
import { MdVolumeOff } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { FaShare } from "react-icons/fa";

const Sidebar = () => {
  const [songs, setSongs] = useState([]); // State to hold songs data
  const [currentSong, setCurrentSong] = useState(null); // State to hold currently playing song
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [isPlaying, setIsPlaying] = useState(false); // State to track if audio is playing
  const [currentTime, setCurrentTime] = useState(0); // State to hold current playback time
  const [totalDuration, setTotalDuration] = useState(0); // State to hold total duration of the current song
  const [topTracksSelected, setTopTracksSelected] = useState(false); // State for Top Tracks selection
  const [volume, setVolume] = useState(1); // State for volume level (1 means full volume)
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 }); // State to manage popup position
  const audioRef = useRef(new Audio()); // Use useRef to maintain audio element across renders

  // Function to fetch songs based on topTracksSelected state
  const fetchSongsData = async (topTracks) => {
    try {
      const songsData = await fetchSongs({ topTracks }); // Fetch songs based on topTracks flag

      // Set songs based on whether top tracks are selected or not
      if (topTracks) {
        const topTracksSongs = songsData.filter(song => song.top_track === true);
        setSongs(topTracksSongs);
        setCurrentSong(topTracksSongs[0]); // Set current song to the first top track song fetched
      } else {
        setSongs(songsData);
        setCurrentSong(songsData[0]); // Set current song to the first song fetched
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      setSongs([]); // Handle error state if needed
    }
  };

  // Effect to fetch songs when topTracksSelected state changes
  useEffect(() => {
    fetchSongsData(topTracksSelected);
  }, [topTracksSelected]);

  // Effect to handle audio playback when currentSong changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.pause();
      const audioUrl = currentSong.url; // Directly use currentSong.url for audio URL
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.volume = volume; // Set initial volume
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setTotalDuration(audioRef.current.duration); // Update total duration when audio starts playing
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
    }
  }, [currentSong]);

  // Function to handle play button click
  const handlePlay = () => {
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
    }
  };

  // Function to handle pause button click
  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // Function to handle next button click
  const handleNext = () => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  };

  // Function to handle previous button click
  const handlePrevious = () => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
  };

  // Function to handle volume button click
  const handleVolumeChange = () => {
    const newVolume = volume === 1 ? 0 : 1; // Toggle between 0 (mute) and 1 (full volume)
    setVolume(newVolume);
    audioRef.current.volume = newVolume; // Update audio element volume
  };

  // Function to handle time update in the audio
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Function to handle seeking in the audio
  const handleSeek = (event) => {
    const seekValue = event.target.value;
    const seekTime = (seekValue / 100) * (audioRef.current?.duration || 0);
    if (isFinite(seekTime)) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Function to handle search term change
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Function to fetch "For You" songs (all songs)
  const handleFetchForYou = () => {
    setTopTracksSelected(false);
    fetchSongsData(false);
  };

  // Function to fetch "Top Tracks" songs (only top tracks)
  const handleFetchTopTracks = () => {
    setTopTracksSelected(true);
    fetchSongsData(true);
  };

  // Function to format time in mm:ss format
  const formatTime = (time) => {
    if (isNaN(time) || time === undefined || time === null) {
      return "00:00"; // Fallback in case time is not valid
    }
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Filter songs based on search term and topTracksSelected
  const filteredSongs = songs.filter(song =>
    (!topTracksSelected || song.top_track === true) && // Only include top tracks if topTracksSelected is true
    (song.name && song.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (song.artist && song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Effect to continuously update current time
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Function to handle showing the popup box in the center of the screen
  const handleShowPopup = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setPopupPosition({ x: centerX, y: centerY });
    setShowPopup(true);
  };

  // Function to handle hiding the popup box
  const handleHidePopup = () => {
    setShowPopup(false);
  };

  // Function to handle click outside the popup (to close it)
  const handleClickOutsidePopup = (event) => {
    if (event.target === event.currentTarget) {
      setShowPopup(false);
    }
  };

  // Effect to handle clicks outside the popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPopup && !event.target.closest(".popup-content")) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <div className="flex flex-row text-white w-11/12 ml-[250px]">
      <div className="w-[450px] h-screen">
        <div className="mt-[35px] mb-[20px] flex">
          <button className={!topTracksSelected ? "text-white mr-8 text-[24px] font-bold" : "mr-8 text-[24px] text-gray-500"} onClick={handleFetchForYou}>For You</button>
          <button className={topTracksSelected ? "text-white mr-8 text-[24px] font-bold" : " text-[24px] text-gray-500"} onClick={handleFetchTopTracks}>Top Tracks</button>
        </div>
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <SongList songs={filteredSongs} setCurrentSong={setCurrentSong} currentSong={currentSong} totalDuration={totalDuration} />
      </div>

      {currentSong && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col flex-start w-[480px] h-[690px]">
            <h1 className="text-2xl left-0 flex-start text-[24px] font-bold">{currentSong.name}</h1>
            <h2 className="text-[16px] mb-6 text-gray-400">{currentSong.artist}</h2>
            <motion.div
              className="bg-center mb-4 w-[480px] h-[510px] top-[101px] left-[874px] rounded-md gap-[32px]"
              style={{ backgroundImage: `url(https://cms.samespace.com/assets/${currentSong.cover})` }}
              animate={{ backgroundImage: `url(https://cms.samespace.com/assets/${currentSong.cover})` }}
            >
            </motion.div>
            <div className="flex flex-col items-center w-[480px]">
              <input
                type="range"
                min="0"
                max={totalDuration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full mb-4 music-ProgressBar"
                style={{
                  '--value': currentTime,
                  '--max': totalDuration,
                }}
              />
            </div>
            <div className="flex items-center justify-between space-x-4 mt-4">
              <div>
                <button onClick={handleShowPopup} className="text-white p-3 rounded-full serchbox hover:bg-gray-600">
                  <SlOptions />
                </button>
                {showPopup && (
                  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50" onClick={handleClickOutsidePopup}>
                    <div className="bg-gray-800 text-white p-4 flex  rounded-md shadow-lg popup-content">
                      <button  className="text-white flex gap-2 p-2 rounded-md hover:bg-gray-600" onClick={handleHidePopup}><AiOutlineLike /> Like</button>
                      <button className="text-white p-2 flex gap-2 rounded-md hover:bg-gray-600" onClick={handleHidePopup}><FaShare /> Share</button>
                    </div>
                  </div>
                )}
              </div>
              <div className='flex justify-between items-center space-x-4'>
                <button onClick={handlePrevious} className="text-white p-3 rounded-full hover:bg-orange-900">
                  <FaBackward />
                </button>
                {isPlaying ? (
                  <button onClick={handlePause} className="text-white p-3 rounded-full serchbox ">
                    <FaPause />
                  </button>
                ) : (
                  <button onClick={handlePlay} className="text-white p-3 rounded-full serchbox ">
                    <FaPlay />
                  </button>
                )}
                <button onClick={handleNext} className="text-white p-3 rounded-full  hover:bg-orange-900">
                  <TbPlayerTrackNextFilled />
                </button>
              </div>
              <div>
                <button onClick={handleVolumeChange} className="text-white p-3 rounded-full serchbox hover:bg-gray-600">
                  {volume === 0 ? <MdVolumeOff /> : <IoVolumeMedium />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
