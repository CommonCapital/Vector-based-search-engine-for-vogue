'use client';

import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import { MetaData } from "./types/document";
import { useEffect, useState } from "react";

interface Props {
  image: string;
  metaData: MetaData['metadata']
}
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


  useEffect(() => {
checkAndBootstrap(setIsBootstrapping, setIsIndexReady);
  })

  return (
   <>
   <SearchBar />
   </>
  );
}
