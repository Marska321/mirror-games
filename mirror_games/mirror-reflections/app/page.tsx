import WordGrid from '../components/WordGrid';
import { neon } from '@neondatabase/serverless';

// 1. Move the logic from your API route directly into this function
async function getPuzzleData() {
  const databaseUrl = process.env.DATABASE_URL;

  // If no database is configured, return null so we use the fallback UI
  if (!databaseUrl) {
    console.log('DATABASE_URL not configured');
    return null;
  }

  const sql = neon(databaseUrl);

  try {
    const data = await sql`
      SELECT puzzle_data
      FROM daily_puzzles
      WHERE DATE(publish_date) = CURRENT_DATE
      LIMIT 1
    `;

    return data.length ? data[0].puzzle_data : null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export default async function Home() {
  // 2. Call the function directly instead of using fetch()
  const puzzleData = await getPuzzleData();

  if (!puzzleData) {
    return (
      <main className="min-h-screen bg-white text-[#2D334A] py-20 px-4">
        <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center shadow-lg">
          <p className="text-3xl font-[var(--font-lora)] italic text-[#2D334A] mb-4">Awakening today's puzzle...</p>
          <p className="text-slate-600">We couldn't load the puzzle. Please check your DATABASE_URL in Vercel settings.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-16 px-4">
      <header className="text-center mb-12">
        <h1 className="text-7xl font-black italic tracking-tighter uppercase mb-2">
          Reflections
        </h1>
        <p className="font-semibold text-[12px] tracking-[0.4em] uppercase text-gray-600">
          The Mirror Connections
        </p>
      </header>

      <div className="w-full max-w-[500px] mb-16">
        <WordGrid puzzleData={puzzleData} />
      </div>
    </main>
  );
}
