"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname to get current path
import { ModeToggle } from "@/components/ui/modeToggle";
import { Button } from "@/components/ui/button";

function Header() {
  const pathname = usePathname(); // Get the current path
  const [isHome, setIsHome] = useState(false);

  // Set isHome to true when we are on the home route '/'
  useEffect(() => {
    if (pathname === "/") {
      setIsHome(true); // We are on the home page
    } else if (pathname === "/bookmarks") {
      setIsHome(false); // We are on the bookmarks page
    }
  }, [pathname]);

  return (
    <div className="flex w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
        {/* Logo / Title wrapped in a Link component */}
        <div className="flex items-center space-x-2">
          <Link href="/" passHref>
            <h1 className="text-2xl font-semibold cursor-pointer">YT 🔍 🔖</h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          {/* Conditionally show "Bookmarks" or "Search" based on the current route */}
          {isHome ? (
            <Link href="/bookmarks" passHref>
              <Button variant="link">Bookmarks</Button>
            </Link>
          ) : (
            <Link href="/" passHref>
              <Button variant="link">Search</Button>
            </Link>
          )}
          <ModeToggle />
        </nav>

        {/* Mobile Menu (Hamburger, for smaller screens) */}
        <div className="md:hidden flex items-center space-x-4">
          <ModeToggle />
          {/* Add a mobile version of the menu (hamburger, etc.) if needed */}
        </div>
      </header>
    </div>
  );
}

export default Header;
