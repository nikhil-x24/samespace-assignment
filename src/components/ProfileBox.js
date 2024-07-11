// import React from 'react';
// import { Link } from 'react-router-dom';
// import profileImg from '../assets/Photos.jpeg'; // Replace with your profile image path

// const ProfileBox = () => {
//   return (
//     <div className="absolute bottom-0 left-0 p-4 cursor-pointer">
//       <Link to="https://nikhilx24-portfolio.vercel.app/">
//         <img src={profileImg} alt="Profile" className="w-12 h-12 rounded-full" />
//       </Link>
//     </div>
//   );
// };

// export default ProfileBox;
import React from 'react';
import profileImg from '../assets/Photos.jpeg'; // Replace with your profile image path

const ProfileBox = () => {
  const handleLinkClick = (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up
    // Optional: Add additional logic here if needed, such as analytics tracking
  };

  return (
    <div className="absolute bottom-0 left-0 p-4 cursor-pointer">
      <a href="https://nikhilx24-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
        <img src={profileImg} alt="Profile" className="w-12 h-12 rounded-full" />
      </a>
    </div>
  );
};

export default ProfileBox;
