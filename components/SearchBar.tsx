"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import youtubeIcon from "../public/youtube.svg"; // Import the SVG file as a static image

interface SearchBarProps {
  setSearchTerm: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tagline, setTagline] = useState(
    "Search YouTube for videos, channels, and more!"
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setLoading(true);
    setSearchTerm(input);
    setTagline("Searching...🔍");

    setTimeout(() => {
      setLoading(false);
      setTagline("Search YouTube for videos, channels, and more!");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center w-full mb-6">
      <Image
        src={youtubeIcon}
        alt="YouTube Icon"
        width={100}
        height={100}
        className="mb-2"
      />
      <p className="text-lg font-medium mb-4">{tagline}</p>
      <form
        onSubmit={handleSearch}
        className="flex justify-center items-center w-full"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search YouTube"
          className="w-2/4"
        />
        <Button type="submit" className="ml-2" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Searching...
            </>
          ) : (
            <Search />
          )}
        </Button>
      </form>
    </div>
  );
};
