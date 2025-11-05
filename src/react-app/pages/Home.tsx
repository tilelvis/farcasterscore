import { useState, useEffect } from 'react';
import { useFarcasterUser } from '@/react-app/hooks/useFarcasterUser';
import UserStatsCard from '@/react-app/components/UserStatsCard';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import ErrorMessage from '@/react-app/components/ErrorMessage';
import type { NeynarUserData, UserStatsResponse } from '@/shared/types';
import { BarChart3, Users, Star } from 'lucide-react';

export default function Home() {
  const { user: farcasterUser, isLoading: isUserLoading } = useFarcasterUser();
  const [userStats, setUserStats] = useState<NeynarUserData | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserStats = async (fid: number) => {
    setIsLoadingStats(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/user-stats/${fid}`);
      const data: UserStatsResponse = await response.json();
      
      if (data.success && data.data) {
        setUserStats(data.data);
      } else {
        setError(data.error || 'Failed to fetch user stats');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (farcasterUser?.fid) {
      fetchUserStats(farcasterUser.fid);
    }
  }, [farcasterUser]);

  const handleRetry = () => {
    if (farcasterUser?.fid) {
      fetchUserStats(farcasterUser.fid);
    }
  };

  // Loading state
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Connecting to Farcaster..." />
        </div>
      </div>
    );
  }

  // Not in Farcaster context
  if (!farcasterUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to FarScore</h1>
              <p className="text-gray-600 max-w-md">
                This app is designed to be used within the Farcaster ecosystem. 
                Please access it through a Farcaster client to view your social metrics.
              </p>
            </div>
            <div className="flex space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>Neynar Score</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Social Metrics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 md:ml-0">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              FarScore
            </h1>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">
            Your comprehensive Farcaster social metrics and Neynar score
          </p>
        </div>

        {/* Main content */}
        <div className="flex justify-center">
          {isLoadingStats ? (
            <LoadingSpinner message="Fetching your stats..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={handleRetry} />
          ) : userStats ? (
            <UserStatsCard userStats={userStats} />
          ) : (
            <LoadingSpinner message="Initializing..." />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Neynar API • Built for Farcaster</p>
        </div>
      </div>
    </div>
  );
}
