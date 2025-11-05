import { useState } from 'react';
import { Search as SearchIcon, User } from 'lucide-react';
import UserStatsCard from '@/react-app/components/UserStatsCard';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import ErrorMessage from '@/react-app/components/ErrorMessage';
import type { NeynarUserData, UserStatsResponse } from '@/shared/types';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userStats, setUserStats] = useState<NeynarUserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setUserStats(null);

    try {
      // Determine if it's a FID (numeric) or username
      const isNumeric = /^\d+$/.test(searchQuery.trim());
      const endpoint = isNumeric 
        ? `/api/user-stats/${searchQuery.trim()}`
        : `/api/user-stats/username/${encodeURIComponent(searchQuery.trim())}`;

      const response = await fetch(endpoint);
      const data: UserStatsResponse = await response.json();

      if (data.success && data.data) {
        setUserStats(data.data);
      } else {
        setError(data.error || 'User not found');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (searchQuery.trim()) {
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <SearchIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              User Search
            </h1>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">
            Search for any Farcaster user by username or FID to view their stats
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter username or FID..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={!searchQuery.trim() || isLoading}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? 'Searching...' : 'Search User'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="flex justify-center">
          {isLoading ? (
            <LoadingSpinner message="Searching for user..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={handleRetry} />
          ) : userStats ? (
            <UserStatsCard userStats={userStats} />
          ) : hasSearched ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No user found</h3>
                <p className="text-gray-600">Try searching with a different username or FID</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                <SearchIcon className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Search for a user</h3>
                <p className="text-gray-600 max-w-sm">
                  Enter a Farcaster username (without @) or FID number to view their stats and Neynar score
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
