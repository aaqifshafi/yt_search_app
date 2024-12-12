"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ui/modeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <div className="h-16">
      <header className="fixed top-0 w-full z-50 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">YT 🔍 🔖</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href={isHome ? "/bookmarks" : "/"}>
              <Button variant="ghost" className="text-sm font-medium">
                {isHome ? "Bookmarks" : "Search"}
              </Button>
            </Link>
            <ModeToggle />
          </nav>

          <div className="md:hidden flex items-center">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="border-b md:hidden bg-background">
            <div className="p-4">
              <Link href={isHome ? "/bookmarks" : "/"}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {isHome ? "Bookmarks" : "Search"}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default Header;
