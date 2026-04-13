import WordGrid from '../components/WordGrid';

async function getPuzzle() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = new URL('/api/puzzle', baseUrl);

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function Home() {
  const puzzleData = await getPuzzle();

  if (!puzzleData) {
    return (
      <main className="min-h-screen bg-white text-[#2D334A] py-20 px-4">
        <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center shadow-lg">
          <p className="text-3xl font-[var(--font-lora)] italic text-[#2D334A] mb-4">Awakening today's puzzle...</p>
          <p className="text-slate-600">We couldn't load the puzzle right now. Refresh the page or try again in a few seconds.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-16 px-4">
      {/* The Header */}
      <header className="text-center mb-12">
        <h1 className="text-7xl font-black italic tracking-tighter uppercase mb-2">
          Reflections
        </h1>
        <p className="font-semibold text-[12px] tracking-[0.4em] uppercase text-gray-600">
          The Mirror Connections
        </p>
      </header>

      {/* The Constrainer */}
      <div className="w-full max-w-[500px] mb-16">
        <WordGrid puzzleData={puzzleData} />
      </div>
    </main>
  );
}
