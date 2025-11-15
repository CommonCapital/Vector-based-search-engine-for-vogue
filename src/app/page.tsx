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
    <div className="relative min-h-screen bg-background">
      {/* Sophisticated geometric background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-border"></div>
        <div className="absolute top-0 left-1/4 w-px h-32 bg-border"></div>
        <div className="absolute top-0 right-1/4 w-px h-32 bg-border"></div>
        <div className="absolute top-32 left-0 w-full h-px bg-border"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        {/* Magazine Header */}
        <div className="border-b-4 border-foreground pb-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline gap-3">
              <div className="w-2 h-2 bg-accent"></div>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground">
                Art Intelligence
              </span>
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-none">
            VOGUE
            <span className="block text-5xl sm:text-6xl lg:text-7xl mt-2 font-light">
              Search
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl font-light leading-relaxed">
            Premium search intelligence for the modern art professionals. Access curated insights from the world's leading fashion.
          </p>
        </div>

        {/* Search Bar - Premium styling */}
        <div className="mx-auto w-full max-w-4xl mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                className="h-16 pr-16 text-lg border-2 border-foreground bg-background focus-visible:ring-accent focus-visible:ring-2 font-light"
                placeholder="Enter your search query..."
              />
              <Button
                onClick={() => handleSearch(query)}
                disabled={isSearching}
                size="lg"
                className="absolute right-2 top-2 h-12 px-6 bg-foreground hover:bg-foreground/90 text-background"
              >
                {isSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && results.length > 0 && (
          <div className="w-full">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-foreground">
              <div className="w-1 h-8 bg-accent"></div>
              <h2 className="text-2xl font-bold tracking-tight">
                SEARCH RESULTS
              </h2>
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-muted-foreground font-medium">
                {results.length} {results.length === 1 ? "Article" : "Articles"}
              </span>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result) => (
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
        )}

        {/* Empty state */}
        {(!results || results.length === 0) && (
          <div className="text-center py-20">
            <div className="inline-block p-8 border-2 border-dashed border-border">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-light text-lg">
                Begin your search to discover insights
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer accent */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
      </div>
    </div>
  );


}
