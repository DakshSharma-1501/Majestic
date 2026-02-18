"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">PlayHere</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/booking"
              className="text-gray-700 hover:text-black transition-colors font-medium"
            >
              Book Turf
            </Link>
            <Link
              href="/sports"
              className="text-gray-700 hover:text-black transition-colors font-medium"
            >
              Sports
            </Link>
            <Link
              href="/locations"
              className="text-gray-700 hover:text-black transition-colors font-medium"
            >
              Locations
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {/* <button className="hidden md:block p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <Search className="w-5 h-5" />
            </button> */}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              {/* <ShoppingCart className="w-6 h-6" /> */}
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User Account */}
            <Link
              href="/dashboard"
              className="hidden md:block p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              {/* <User className="w-6 h-6" /> */}
            </Link>

            {/* Login Button */}
            <Link
              href="/login"
              className="hidden md:block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Login
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              {/* {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )} */}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="/products"
              className="block text-gray-700 hover:text-purple-600 py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/designs"
              className="block text-gray-700 hover:text-purple-600 py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Designs
            </Link>
            <Link
              href="/designers"
              className="block text-gray-700 hover:text-purple-600 py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Designers
            </Link>
            <Link
              href="/categories"
              className="block text-gray-700 hover:text-purple-600 py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <button
              onClick={() => {
                setIsCategoryModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="block text-left w-full text-gray-700 hover:text-purple-600 py-2 font-medium"
            >
              Customize
            </button>
            <Link
              href="/dashboard"
              className="block text-gray-700 hover:text-purple-600 py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Account
            </Link>
            <Link
              href="/login"
              className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
