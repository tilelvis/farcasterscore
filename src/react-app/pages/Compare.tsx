import { useState } from 'react';
import { Users, Search, Trophy, UserPlus } from 'lucide-react';
import type { NeynarUserData, UserStatsResponse } from '@/shared/types';

export default function Compare() {
  const [user1Query, setUser1Query] = useState('');
  const [user2Query, setUser2Query] = useState('');
  const [user1Stats, setUser1Stats] = useState<NeynarUserData | null>(null);
  const [user2Stats, setUser2Stats] = useState<NeynarUserData | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  const fetchUserStats = async (query: string, setUser: (user: NeynarUserData | null) => void, setLoading: (loading: boolean) => void, setError: (error: string | null) => void) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setUser(null);

    try {
      const isNumeric = /^\d+$/.test(query.trim());
      const endpoint = isNumeric 
        ? `/api/user-stats/${query.trim()}`
        : `/api/user-stats/username/${encodeURIComponent(query.trim())}`;

      const response = await fetch(endpoint);
      const data: UserStatsResponse = await response.json();

      if (data.success && data.data) {
        setUser(data.data);
      } else {
        setError(data.error || 'User not found');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Component implementation continues... (truncated for space)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Compare Users
          </h1>
          <p className="text-gray-600">Compare Farcaster users side by side</p>
        </div>
        {/* Implementation continues... */}
      </div>
    </div>
  );
}
