import { Hono } from "hono";
import { cors } from "hono/cors";
import { NeynarUserDataSchema } from "@/shared/types";

interface AppEnv {
  NEYNAR_API_KEY: string;
}

const app = new Hono<{ Bindings: AppEnv }>();

// Enable CORS for all routes
app.use("/*", cors());

// Helper function to process user data from Neynar API
const processUserData = (user: any) => {
  const score = user.experimental?.neynar_user_score || 
                user.neynar_user_score || 
                user.score;

  return {
    fid: user.fid,
    username: user.username,
    displayName: user.display_name || user.displayName,
    pfpUrl: user.pfp_url || user.pfp?.url,
    followerCount: user.follower_count || 0,
    followingCount: user.following_count || 0,
    score: score
  };
};

// API endpoint to fetch user stats by FID
app.get("/api/user-stats/:fid", async (c) => {
  const fid = c.req.param("fid");
  const neynarApiKey = c.env.NEYNAR_API_KEY;

  if (!neynarApiKey) {
    return c.json({
      success: false,
      error: "Neynar API key not configured"
    }, 500);
  }

  try {
    // Fetch user data from Neynar API
    const userResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'accept': 'application/json',
        'api_key': neynarApiKey
      }
    });

    if (!userResponse.ok) {
      throw new Error(`Neynar API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json() as any;
    
    if (!userData.users || userData.users.length === 0) {
      return c.json({
        success: false,
        error: "User not found"
      }, 404);
    }

    const user = userData.users[0];
    const userStats = processUserData(user);

    // Validate the response data
    const validatedStats = NeynarUserDataSchema.parse(userStats);

    return c.json({
      success: true,
      data: validatedStats
    });

  } catch (error) {
    console.error("Error fetching user stats:", error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch user stats"
    }, 500);
  }
});

// API endpoint to fetch user stats by username
app.get("/api/user-stats/username/:username", async (c) => {
  const username = c.req.param("username");
  const neynarApiKey = c.env.NEYNAR_API_KEY;

  if (!neynarApiKey) {
    return c.json({
      success: false,
      error: "Neynar API key not configured"
    }, 500);
  }

  try {
    // First, get user by username to find their FID
    const userSearchResponse = await fetch(`https://api.neynar.com/v1/farcaster/user-by-username?username=${encodeURIComponent(username)}`, {
      headers: {
        'accept': 'application/json',
        'api_key': neynarApiKey
      }
    });

    if (!userSearchResponse.ok) {
      if (userSearchResponse.status === 404) {
        return c.json({
          success: false,
          error: "User not found"
        }, 404);
      }
      throw new Error(`Neynar API error: ${userSearchResponse.status}`);
    }

    const userSearchData = await userSearchResponse.json() as any;
    const fid = userSearchData.result?.user?.fid;

    if (!fid) {
      return c.json({
        success: false,
        error: "User not found"
      }, 404);
    }

    // Now fetch full user data with the FID
    const userResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'accept': 'application/json',
        'api_key': neynarApiKey
      }
    });

    if (!userResponse.ok) {
      throw new Error(`Neynar API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json() as any;
    
    if (!userData.users || userData.users.length === 0) {
      return c.json({
        success: false,
        error: "User not found"
      }, 404);
    }

    const user = userData.users[0];
    const userStats = processUserData(user);

    // Validate the response data
    const validatedStats = NeynarUserDataSchema.parse(userStats);

    return c.json({
      success: true,
      data: validatedStats
    });

  } catch (error) {
    console.error("Error fetching user stats by username:", error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch user stats"
    }, 500);
  }
});

// API endpoint to fetch leaderboard
app.get("/api/leaderboard", async (c) => {
  const neynarApiKey = c.env.NEYNAR_API_KEY;

  if (!neynarApiKey) {
    return c.json({
      success: false,
      error: "Neynar API key not configured"
    }, 500);
  }

  try {
    // For now, we'll use a predefined list of popular FIDs
    // In a real implementation, you'd want to maintain a database of users
    // or use Neynar's trending endpoints
    const popularFids = [
      3, 602, 1689, 99, 5650, 829, 2433, 4823, 239, 6546,
      5, 680, 457, 13242, 7086, 7499, 1048, 1214, 2, 2532
    ];

    // Fetch data for these users
    const userResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${popularFids.join(',')}`, {
      headers: {
        'accept': 'application/json',
        'api_key': neynarApiKey
      }
    });

    if (!userResponse.ok) {
      throw new Error(`Neynar API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json() as any;
    
    if (!userData.users || userData.users.length === 0) {
      return c.json({
        success: false,
        error: "No users found"
      }, 404);
    }

    // Process and sort users by Neynar score
    const processedUsers = userData.users
      .map((user: any) => processUserData(user))
      .filter((user: any) => user.score !== undefined && user.score !== null)
      .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
      .slice(0, 20); // Top 20 users

    // Validate all user data
    const validatedUsers = processedUsers.map((user: any) => NeynarUserDataSchema.parse(user));

    return c.json({
      success: true,
      data: validatedUsers
    });

  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch leaderboard"
    }, 500);
  }
});

// API endpoint for user discovery
app.get("/api/discovery", async (c) => {
  const neynarApiKey = c.env.NEYNAR_API_KEY;
  const userFid = c.req.query("fid");

  if (!neynarApiKey) {
    return c.json({
      success: false,
      error: "Neynar API key not configured"
    }, 500);
  }

  try {
    // Get trending/popular users (using a mix of high-score users and active users)
    const trendingFids = [
      3, 602, 1689, 99, 5650, 829, 2433, 4823, 239, 6546,
      5, 680, 457, 13242, 7086, 7499, 1048, 1214, 2, 2532,
      382, 8152, 6131, 3621, 20, 1956, 15, 616, 6833, 3
    ];

    // Fetch trending users data
    const trendingResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${trendingFids.slice(0, 15).join(',')}`, {
      headers: {
        'accept': 'application/json',
        'api_key': neynarApiKey
      }
    });

    let trendingUsers: any[] = [];
    if (trendingResponse.ok) {
      const trendingData: any = await trendingResponse.json();
      if (trendingData.users) {
        trendingUsers = trendingData.users
          .map((user: any) => processUserData(user))
          .filter((user: any) => user.score !== undefined)
          .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
          .slice(0, 10);
      }
    }

    let recommendations: any[] = [];
    let similarUsers: any[] = [];

    // If user FID is provided, generate personalized recommendations
    if (userFid) {
      try {
        // Get user's following list to generate recommendations
        const followingResponse = await fetch(`https://api.neynar.com/v2/farcaster/following?fid=${userFid}&limit=50`, {
          headers: {
            'accept': 'application/json',
            'api_key': neynarApiKey
          }
        });

        if (followingResponse.ok) {
          const followingData: any = await followingResponse.json();
          
          // Extract FIDs from following
          const followingFids = followingData.users?.map((user: any) => user.fid) || [];
          
          // Get some users not in following list as recommendations
          const potentialRecommendations = trendingFids
            .filter(fid => !followingFids.includes(fid) && fid.toString() !== userFid)
            .slice(0, 12);

          if (potentialRecommendations.length > 0) {
            const recResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${potentialRecommendations.join(',')}`, {
              headers: {
                'accept': 'application/json',
                'api_key': neynarApiKey
              }
            });

            if (recResponse.ok) {
              const recData: any = await recResponse.json();
              if (recData.users) {
                recommendations = recData.users
                  .map((user: any) => processUserData(user))
                  .slice(0, 8);
              }
            }
          }
        }

        // Get user's own data for similar users
        const userResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${userFid}`, {
          headers: {
            'accept': 'application/json',
            'api_key': neynarApiKey
          }
        });

        if (userResponse.ok) {
          const userData: any = await userResponse.json();
          if (userData.users && userData.users.length > 0) {
            const currentUser = processUserData(userData.users[0]);
            
            // Find similar users based on follower count ranges
            const similarRange = {
              min: Math.max(0, currentUser.followerCount * 0.5),
              max: currentUser.followerCount * 2
            };

            // Filter trending users for similar metrics
            similarUsers = trendingUsers
              .filter(user => 
                user.fid.toString() !== userFid &&
                user.followerCount >= similarRange.min && 
                user.followerCount <= similarRange.max
              )
              .slice(0, 8);
          }
        }
      } catch (personalizedError) {
        console.error("Error generating personalized recommendations:", personalizedError);
        // Continue with just trending users
      }
    }

    // Validate all data
    const validatedTrending = trendingUsers.map(user => NeynarUserDataSchema.parse(user));
    const validatedRecommendations = recommendations.map(user => NeynarUserDataSchema.parse(user));
    const validatedSimilar = similarUsers.map(user => NeynarUserDataSchema.parse(user));

    return c.json({
      success: true,
      data: {
        trending: validatedTrending,
        recommendations: validatedRecommendations,
        similarUsers: validatedSimilar
      }
    });

  } catch (error) {
    console.error("Error fetching discovery data:", error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch discovery data"
    }, 500);
  }
});

// Health check endpoint
app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
