import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

// FALLBACK PUZZLE (if database unavailable)
const FALLBACK_PUZZLE = {
  groups: [
    {
      words: ["APPLE", "ORANGE", "BANANA", "GRAPE"],
      category: "FRUITS",
      color: "#FFA500"
    },
    {
      words: ["CAR", "BIKE", "TRUCK", "BUS"],
      category: "VEHICLES",
      color: "#4169E1"
    },
    {
      words: ["RED", "BLUE", "GREEN", "YELLOW"],
      category: "COLORS",
      color: "#32CD32"
    },
    {
      words: ["HAPPY", "SAD", "ANGRY", "TIRED"],
      category: "EMOTIONS",
      color: "#FFD700"
    }
  ]
};

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  // If no database configured, use fallback puzzle
  if (!databaseUrl) {
    console.log('DATABASE_URL not configured, using fallback puzzle');
    return NextResponse.json(FALLBACK_PUZZLE);
  }

  const sql = neon(databaseUrl);

  try {
    const data = await sql`
      SELECT puzzle_data
      FROM daily_puzzles
      WHERE DATE(publish_date) = CURRENT_DATE
      LIMIT 1
    `;

    // If no puzzle for today, use fallback
    if (!data.length) {
      console.log('No puzzle for today, using fallback puzzle');
      return NextResponse.json(FALLBACK_PUZZLE);
    }

    return NextResponse.json(data[0].puzzle_data);
  } catch (error) {
    console.error('Database error:', error);
    console.log('Database connection failed, using fallback puzzle');
    // Return fallback puzzle instead of error
    return NextResponse.json(FALLBACK_PUZZLE);
  }
}
