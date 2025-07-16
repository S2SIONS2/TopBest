import { db } from '@/db';
import { games, reviews } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allGames = await db.select().from(games).orderBy(desc(games.recommendations), desc(games.createdAt));
    return NextResponse.json(allGames);
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { steamAppId, name, headerImage, shortReview, shortDescription } = body; // Added shortDescription

    if (!steamAppId || !name || !headerImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let gameId: number;

    const existingGame = await db.query.games.findFirst({
      where: eq(games.steamAppId, steamAppId),
    });

    if (existingGame) {
      gameId = existingGame.id;
      await db.update(games)
        .set({ 
            recommendations: existingGame.recommendations + 1, 
            updatedAt: new Date(),
            shortDescription: shortDescription || existingGame.shortDescription // Update description if provided
        })
        .where(eq(games.id, gameId));
    } else {
      const newGame = await db.insert(games).values({
        steamAppId,
        name,
        headerImage,
        shortDescription, // Save shortDescription for new games
      }).returning({ id: games.id });
      gameId = newGame[0].id;
    }

    // Always insert a new review if it's provided
    if (shortReview && shortReview.trim() !== '') {
      await db.insert(reviews).values({
        gameId: gameId,
        text: shortReview,
      });
    }

    const finalGame = await db.query.games.findFirst({ where: eq(games.id, gameId) });

    return NextResponse.json(finalGame, { status: existingGame ? 200 : 201 });

  } catch (error) {
    console.error('Failed to recommend game:', error);
    return NextResponse.json({ error: 'Failed to recommend game' }, { status: 500 });
  }
}