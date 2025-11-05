import { useState, useEffect } from 'react';

interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

export function useFarcasterUser() {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user data is already available
    const checkUserData = () => {
      const fid = (window as any).userFid;
      if (fid) {
        setUser({
          fid,
          username: (window as any).userUsername,
          displayName: (window as any).userDisplayName,
          pfpUrl: (window as any).userPfpUrl,
        });
        setIsLoading(false);
        return true;
      }
      return false;
    };

    // Try to get user data immediately
    if (!checkUserData()) {
      // Listen for the custom event
      const handleUserLoaded = (event: CustomEvent) => {
        setUser(event.detail.user);
        setIsLoading(false);
      };

      window.addEventListener('farcasterUserLoaded', handleUserLoaded as EventListener);

      // Set a timeout to stop loading if no user data is received
      const timeout = setTimeout(() => {
        if (!checkUserData()) {
          setIsLoading(false);
        }
      }, 3000);

      return () => {
        window.removeEventListener('farcasterUserLoaded', handleUserLoaded as EventListener);
        clearTimeout(timeout);
      };
    }
  }, []);

  return { user, isLoading };
}
