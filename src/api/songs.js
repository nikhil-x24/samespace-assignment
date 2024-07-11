import axios from 'axios';

const API_URL = 'https://cms.samespace.com/items/songs';

export const fetchSongs = async ({ topTracks = false }) => {
  try {
    let url = API_URL;

    if (topTracks) {
      url = `${API_URL}?top_track=true`; // Adjust the URL or parameters to fetch top tracks if needed
    }

    const response = await axios.get(url);
    return response.data.data; // Assuming response.data contains the data array
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw error; // Rethrow the error to handle it in the component or handle it here
  }
};



