"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-xl">
              Cast<span className="text-primary">SG</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-primary transition-colors">
              How it works
            </a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-primary transition-colors">
              FAQ
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm text-gray-700 hover:text-primary transition-colors px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="text-sm text-white bg-primary hover:bg-primary-dark transition-colors px-5 py-2.5 rounded-full font-medium"
            >
              Get started
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-600 py-2" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm text-gray-600 py-2" onClick={() => setIsMenuOpen(false)}>How it works</a>
            <a href="#pricing" className="block text-sm text-gray-600 py-2" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <a href="#faq" className="block text-sm text-gray-600 py-2" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            <div className="pt-3 border-t border-border space-y-2">
              <Link href="/auth/login" className="block text-sm text-center text-gray-700 py-2">Sign in</Link>
              <Link href="/auth/register" className="block text-sm text-center text-white bg-primary rounded-full py-2.5 font-medium">Get started</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
