import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 2]; // Extract ID from URL pathname (second to last segment)
    const gameId = parseInt(id || '');

    if (isNaN(gameId)) {
      return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
    }

    const gameReviews = await db.select()
      .from(reviews)
      .where(eq(reviews.gameId, gameId))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json(gameReviews);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}