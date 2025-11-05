import { sdk } from '@farcaster/miniapp-sdk'

interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

export async function initializeFrame() {
  const context = await sdk.context

  if (!context || !context.user) {
    console.log('not in mini app context')
    return
  }

  const user: FarcasterUser = context.user;

  // Store user fid globally for access in React components
  (window as any).userFid = user.fid;
  (window as any).userUsername = user.username;
  (window as any).userDisplayName = user.displayName;
  (window as any).userPfpUrl = user.pfpUrl;

  // Dispatch custom event to notify React components
  window.dispatchEvent(new CustomEvent('farcasterUserLoaded', {
    detail: { user }
  }));

  // Call the ready function to remove splash screen
  await sdk.actions.ready();
}
