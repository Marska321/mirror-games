"use client";
import React, { useState, useEffect } from 'react';
import { Roboto_Slab, Inter } from 'next/font/google';

const slab = Roboto_Slab({ subsets: ['latin'], weight: ['700', '900'] });
const sans = Inter({ subsets: ['latin'], weight: ['400', '600'] });

interface Category {
  category: string;
  words: string[];
}

export default function WordGrid({ puzzleData }: { puzzleData: any }) {
  // Safely extract the array whether it was passed directly or wrapped in a 'groups' object
  const validData: Category[] | null = Array.isArray(puzzleData) ? puzzleData : (puzzleData?.groups || null);

  const [allWords, setAllWords] = useState<{ word: string; category: string }[]>([]);
  const [initialGrid, setInitialGrid] = useState<{ word: string; category: string }[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [solvedCategories, setSolvedCategories] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(4);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!validData) return;

    const flattened = validData.flatMap(group =>
      group.words.map(w => ({ word: w, category: group.category }))
    );
    const shuffled = flattened.sort(() => Math.random() - 0.5);
    setInitialGrid(shuffled);
    setAllWords([...shuffled]);
    setSelected([]);
    setSolvedCategories([]);
    setMistakes(4);
    setIsGameOver(false);
  }, [validData]);

  const resetGame = () => {
    setAllWords([...initialGrid]);
    setSelected([]);
    setSolvedCategories([]);
    setMistakes(4);
    setIsGameOver(false);
  };

  const toggleSelect = (word: string) => {
    if (selected.includes(word)) {
      setSelected(selected.filter(w => w !== word));
    } else if (selected.length < 4) {
      setSelected([...selected, word]);
    }
  };

  const checkGuess = () => {
    const firstWord = allWords.find(w => w.word === selected[0]);
    const isMatch = selected.every(s =>
      allWords.find(w => w.word === s)?.category === firstWord?.category
    );

    if (isMatch && firstWord) {
      setSolvedCategories([...solvedCategories, firstWord.category]);
      setAllWords(allWords.filter(w => !selected.includes(w.word)));
      setSelected([]);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);

      const newMistakes = mistakes - 1;
      setMistakes(newMistakes);
      setTimeout(() => setSelected([]), 400);

      if (newMistakes === 0) {
        setIsGameOver(true);
      }
    }
  };

  const shuffleWords = () => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    setAllWords(shuffled);
  };

  if (!validData) {
    return (
      <div className={`w-full mx-auto p-8 text-center ${sans.className}`}>
        <p className="text-red-500 font-bold">Unable to load the puzzle.</p>
        <p className="text-sm mt-2 text-gray-600">Please refresh the page or check your database connection.</p>
      </div>
    );
  }

  return (
    <div className={`w-full mx-auto px-4 pb-8 ${sans.className}`}>
      {/* The Instruction Text */}
      <p className="text-center mb-8 text-base font-medium">Create four groups of four!</p>

      <div className="flex flex-col gap-3">
        {/* Solved Groups */}
        {solvedCategories.map((cat, index) => (
          <div
            key={cat}
            className={`neo-tile tier-${index} h-auto py-5 flex flex-col gap-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in duration-300`}
          >
            <span className={`text-xl font-black tracking-tight ${slab.className}`}>{cat}</span>
            <span className="text-xs font-semibold uppercase tracking-wider">
              {validData.find(g => g.category === cat)?.words.join(', ')}
            </span>
          </div>
        ))}

        {/* The Active Grid */}
        <div className="grid grid-cols-4 gap-3 w-full mb-8">
          {allWords.map(({ word }) => (
            <button
              key={word}
              onClick={() => toggleSelect(word)}
              className={`neo-tile w-full font-bold ${selected.includes(word) ? 'neo-tile-selected' : ''}`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* --- BOTTOM CONTROL SECTION --- */}
      <div className="mt-12 flex flex-col items-center gap-12">
        
        {/* The Mistakes Counter with its own spacing */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-[14px] font-semibold tracking-wide text-[#333]">
            Mistakes Remaining:
          </span>
          <div className="flex gap-3">
            {/* Logic: If mistakes = 4, show 4 dark dots. 
               As mistakes decrease, dots turn light. 
            */}
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3.5 h-3.5 rounded-full transition-all duration-500 border border-black/10 ${
                  i < mistakes ? 'bg-[#5a594e] shadow-sm' : 'bg-[#efefe6]'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* The Actions Bar */}
        <div className="flex gap-4">
          <button 
            onClick={shuffleWords}
            className="px-8 py-3 border-[1.5px] border-black rounded-full text-sm font-bold hover:bg-[#efefe6] active:scale-95 transition-all"
          >
            Shuffle
          </button>
          <button 
            onClick={checkGuess}
            disabled={selected.length !== 4}
            className="px-8 py-3 border-[1.5px] border-black rounded-full text-sm font-bold bg-white disabled:opacity-20 disabled:border-gray-300 disabled:text-gray-400 active:scale-95 transition-all"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
