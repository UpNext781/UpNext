"use client";

import ChatInterface from './components/ChatInterface';
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col w-full max-w-3xl items-center py-20 px-6 sm:items-start">
        <div className="mb-12">
          <Image 
            className="dark:invert" 
            src="/next.svg" 
            alt="UpNext Logo" 
            width={120} 
            height={24} 
            priority 
          />
        </div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="max-w-md text-4xl font-bold tracking-tighter text-black dark:text-zinc-50 uppercase italic">
            UpNext Concierge
          </h1>
          
          <p className="max-w-md text-lg leading-7 text-zinc-600 dark:text-zinc-400 mb-4">
            Your high-end noir tactical strategist and protector. Choose your contact below.
          </p>

          {/* This is the Chat UI for Roxy and Lucas */}
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
