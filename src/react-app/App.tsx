import { BrowserRouter as Router, Routes, Route } from "react-router";
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
      <div className="flex">
        <Navigation />
        <div className="flex-1">
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
