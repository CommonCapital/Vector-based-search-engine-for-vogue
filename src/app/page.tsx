'use client';


import Image from "next/image";
import { MetaData, VogueVector } from "./types/document";
import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { VogueCard } from "@/components/VogueCard";


const runBootstrapProcedure = async () => {
  const response = await fetch("/api/bootstrap", {
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to initiate bootstrap process");
  }
}
const checkAndBootstrap = async (setIsBootstrapping: (isBootstrapping: boolean) => void, setIsIndexReady: (isIndexReady: boolean) => void) => {
setIsBootstrapping(true);
await runBootstrapProcedure();
setIsBootstrapping(false)
setIsIndexReady(true);
}


export default function Home() {
const [isBootstrapping, setIsBootstrapping] = useState(false)
const [isIndexReady, setIsIndexReady] = useState(false)
const [isSearching, setIsSearching] = useState(false)
const [results, setResults] = useState<MetaData['metadata'][]>([])
const [query, setQuery] = useState("")
const handleSearch = async (query: string) => {
setIsSearching(true);
setResults([])
const response = await fetch("/api/search", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",

  },
  body: JSON.stringify({query}),
});
if (!response.ok) {
  setIsSearching(false);
  const body = await response.json();
  console.log("Search failed:", body);
  throw new Error("Search request failed");
  
}

const results = await response.json();
console.log("Search results:", results)


setResults(Array.isArray(results.data) ? results.data : []);
setIsSearching(false);
}

  useEffect(() => {
checkAndBootstrap(setIsBootstrapping, setIsIndexReady);
  }, []);

return (
  <div className="relative min-h-screen isolate bg-white">
    <svg
      className="absolute inset-0 -z-10 h-full w-full stroke-gray-200"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
          width={200}
          height={200}
          x="50%"
          y={-1}
          patternUnits="userSpaceOnUse"
        >
          <path d="M.5 200V.5H200" fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
      />
    </svg>

    <div className="mx-auto max-w-7xl px-6 pt-10 lg:flex lg:gap-16 lg:px-8 lg:py-24">
      <div className="w-full flex flex-col items-center gap-4">
        <Icons.Sparkles className="h-12 w-16" />
        <h1 className="tracking-tight text-4xl sm:text-6xl font-bold">Vogue Search</h1>
        <p className="max-w-xl text-center text-lg text-slate-700">
          A powerful search engine for Vogue.
        </p>

        {/* Search Bar */}
        <div className="mx-auto mt-16 w-full max-w-2xl">
          <div className="relative h-14">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-12 h-full rounded-md border"
              placeholder="Search..."
            />
            <Button
            onClick={() =>handleSearch(query)}
              disabled={isSearching}
              size="sm"
              className="absolute right-0 top-0 h-full rounded-l-none px-4 flex items-center justify-center"
            >
              {isSearching ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Search className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
     <div className="mt-8 w-full max-w-6xl h-[60vh] overflow-y-auto overflow-x-hidden border-t border-gray-200 pt-4">
  <div className="grid grid-cols-3 gap-4">
    {results?.map((result) => (
      <VogueCard
        key={result.id}
        author={result.author}
        date={result.date}
        description={result.description}
        id={result.id}
        image_url={result.image_url}
        name={result.name}
        source_url={result.source_url}
      />
    ))}
  </div>
</div>

      </div>
    </div>
  </div>
);

}
