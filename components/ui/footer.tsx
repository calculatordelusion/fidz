'use client';

import React from 'react';
import Link from 'next/link';
import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border py-6 px-6 md:px-10 bg-background/60 backdrop-blur">
      <div className="container flex items-center justify-between text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Text Behind Image</span>
        <span className="hidden md:inline">Crafted with care</span>
      </div>
    </footer>
  );
};

export default Footer; 