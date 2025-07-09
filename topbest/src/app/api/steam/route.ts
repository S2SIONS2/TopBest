
import { NextRequest, NextResponse } from 'next/server';

// Cache the app list to avoid fetching it on every search request.
let appListCache: { appid: number; name: string }[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function getAppList() {
  const currentTime = Date.now();
  if (currentTime - lastFetchTime < CACHE_DURATION && appListCache.length > 0) {
    return appListCache;
  }

  try {
    const response = await fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
    if (!response.ok) {
      throw new Error('Failed to fetch Steam app list');
    }
    const data = await response.json();
    appListCache = data.applist.apps;
    lastFetchTime = currentTime;
    return appListCache;
  } catch (error) {
    console.error('Error fetching Steam app list:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search');
  const appId = searchParams.get('appid');
  const apiKey = process.env.NEXT_PUBLIC_STEAM_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Steam API key is not configured.' }, { status: 500 });
  }

  // Search for games by name
  if (searchTerm) {
    try {
      const allApps = await getAppList();
      const searchResults = allApps
        .filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 20); // Return top 20 matches
      return NextResponse.json(searchResults);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return NextResponse.json({ error: 'Failed to search for games.', details: errorMessage }, { status: 500 });
    }
  }

  // Get game details by appid
  if (appId) {
    try {
      const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}&key=${apiKey}&l=korean`);
      if (!response.ok) {
        throw new Error(`Failed to fetch game details for appid: ${appId}`);
      }
      const data = await response.json();
      
      // The API returns a wrapper object with the appid as the key.
      if (data[appId] && data[appId].success) {
        return NextResponse.json(data[appId].data);
      } else {
        return NextResponse.json({ error: data[appId]?.data?.message || 'Could not retrieve game details.' }, { status: 404 });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return NextResponse.json({ error: 'Failed to fetch game details.', details: errorMessage }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Please provide a search term or an appid.' }, { status: 400 });
}
