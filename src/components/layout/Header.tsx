'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useAdmin } from '@/hooks/use-admin';
import { useContentSection } from '@/hooks/use-content-section';
import { useNavigation } from '@/hooks/use-navigation';
import { Loader2 } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useAdmin();
  const { content: siteInfo, loading } = useContentSection('site_info');
  const { navigationItems, loading: navLoading } = useNavigation();

  // Fallback site information
  const fallbackSiteInfo = {
    site_title: 'Bulan Bahasa & Hari Santri 2025',
    event_name: 'EKSPRESI'
  };

  const currentSiteInfo = loading ? fallbackSiteInfo : {
    site_title: siteInfo.site_title || fallbackSiteInfo.site_title,
    event_name: siteInfo.event_name || fallbackSiteInfo.event_name
  };

  // Fallback navigation items
  const fallbackNavItems = [
    { name: 'Home', href: '/' },
    { name: 'About The Competitions', href: '/competitions' },
    { name: 'Schedule & Timeline', href: '/schedule' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Register/Info', href: '/register' },
    { name: 'Contact', href: '/contact' },
  ];

  // Use dynamic navigation items if available, otherwise fallback
  const navItems = navLoading || navigationItems.length === 0 
    ? fallbackNavItems 
    : navigationItems.map(item => ({
        name: item.label,
        href: item.href
      }));

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg">
              <div className="text-center leading-tight">
                <div className="font-bold text-sm">EKSPRESI</div>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-gray-800">
                {String(currentSiteInfo.site_title || '')}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Authentication */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <UserButton />
            </SignedIn>
            
            {/* Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Authentication & Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Mobile Authentication */}
            <div className="md:hidden">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200">
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`block h-0.5 w-6 bg-gray-700 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-gray-700 opacity-100 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-gray-700 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Link */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-orange-500 hover:text-orange-600 font-medium py-2 text-left transition-colors duration-200">
                    Login / Sign Up
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;