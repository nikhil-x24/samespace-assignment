import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Logo from './components/Logo';
import ProfileBox from './components/ProfileBox';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center text-white overflow-hidden">
          <Logo />
          <ProfileBox />
          <Sidebar />
        </div>
    </Router>
  );
};

export default App;
