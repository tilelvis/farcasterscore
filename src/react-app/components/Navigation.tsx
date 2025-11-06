// src/react-app/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Use react-router-dom
import HomePage from "@/react-app/pages/Home";
import SearchPage from "@/react-app/pages/Search";
import LeaderboardPage from "@/react-app/pages/Leaderboard";
import ComparePage from "@/react-app/pages/Compare";
import DiscoveryPage from "@/react-app/pages/Discovery";
import Navigation from "@/react-app/components/Navigation";
import { FrameInit } from "@/react-app/components/FrameInit";

export default function App() {

  return (
    <Router>
      {/* The main container uses flex to place the Navigation next to the content on desktop */}
      <div className="flex min-h-screen"> 
        
        {/* Navigation now controls itself and occupies desktop space (w-64) */}
        <Navigation /> 

        {/* This div is the main content area */}
        <div 
          className="flex-1 transition-all duration-300 p-4 md:p-8"
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/discovery" element={<DiscoveryPage />} />
          </Routes>
        </div>
        <FrameInit />
      </div>
    </Router>
  );
}