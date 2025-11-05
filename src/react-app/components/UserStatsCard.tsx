import { Users, UserPlus, Trophy, Star } from 'lucide-react';
import type { NeynarUserData } from '@/shared/types';

interface UserStatsCardProps {
  userStats: NeynarUserData;
}

export default function UserStatsCard({ userStats }: UserStatsCardProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
      {/* Header with user info */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center space-x-4">
          {userStats.pfpUrl ? (
            <img 
              src={userStats.pfpUrl} 
              alt={userStats.displayName || userStats.username || 'User'} 
              className="w-16 h-16 rounded-full border-4 border-white/20 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 border-4 border-white/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold">
              {userStats.displayName || userStats.username || `User ${userStats.fid}`}
            </h2>
            {userStats.username && (
              <p className="text-purple-100">@{userStats.username}</p>
            )}
            <p className="text-purple-200 text-sm">FID: {userStats.fid}</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="p-6 space-y-4">
        {/* Neynar Score */}
        {userStats.score !== undefined && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Neynar Score</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.score.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Followers and Following */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Followers</p>
                <p className="text-xl font-bold text-gray-900">{userStats.followerCount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 rounded-xl">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Following</p>
                <p className="text-xl font-bold text-gray-900">{userStats.followingCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional metrics */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-xl">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Engagement Ratio</p>
                <p className="text-lg font-bold text-gray-900">
                  {userStats.followerCount > 0 
                    ? (userStats.followingCount / userStats.followerCount).toFixed(2)
                    : '0.00'
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Following/Followers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
