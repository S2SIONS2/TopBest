import { NextResponse } from 'next/server';
import { db } from '@/db';
import { games } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET a single game by id
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Extract ID from URL pathname
    const gameId = parseInt(id || '', 10);

    if (isNaN(gameId)) {
      return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
    }

    const game = await db.select().from(games).where(eq(games.id, gameId));

    if (game.length === 0) {
      return NextResponse.json({ error: 'Game not found.' }, { status: 404 });
    }

    return NextResponse.json(game[0]);
  } catch (error) {
    console.error(`Error fetching game:`, error);
    return NextResponse.json({ error: 'Failed to fetch game.' }, { status: 500 });
  }
}

// PUT (update) a game's review
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Extract ID from URL pathname
    const gameId = parseInt(id || '', 10);

    if (isNaN(gameId)) {
      return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
    }

    // const body = await request.json(); // Removed body variable

    // shortReview is no longer updated directly on the games table
    // const { shortReview } = body;

    // if (typeof shortReview !== 'string') {
    //   return NextResponse.json({ error: 'shortReview must be a string.' }, { status: 400 });
    // }

    // Example of updating other game properties if needed
    // const { name, headerImage } = body;
    // const updatedGame = await db
    //   .update(games)
    //   .set({ name, headerImage, updatedAt: new Date() })
    //   .where(eq(games.id, gameId))
    //   .returning();

    return NextResponse.json({ message: 'Game update logic needs to be defined based on what properties are being updated.' }, { status: 200 });

  } catch (error) {
    console.error(`Error updating game:`, error);
    return NextResponse.json({ error: 'Failed to update game.' }, { status: 500 });
  }
}

// DELETE a game
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Extract ID from URL pathname
    const gameId = parseInt(id || '', 10);

    if (isNaN(gameId)) {
      return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
    }

    const deletedGame = await db.delete(games).where(eq(games.id, gameId)).returning();

    if (deletedGame.length === 0) {
      return NextResponse.json({ error: 'Game not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: `Game with id ${gameId} deleted successfully.` });
  } catch (error) {
    console.error(`Error deleting game:`, error);
    return NextResponse.json({ error: 'Failed to delete game.' }, { status: 500 });
  }
}