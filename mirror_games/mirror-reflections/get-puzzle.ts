import { neon } from '@neondatabase/serverless';

export async function getPuzzleData() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  const sql = neon(databaseUrl);
  try {
    const data = await sql`
      SELECT puzzle_data FROM daily_puzzles 
      WHERE DATE(publish_date) = CURRENT_DATE LIMIT 1
    `;
    return data.length ? data[0].puzzle_data : null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}
