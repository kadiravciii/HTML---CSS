import React from 'react';
import { LineChart } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-black p-4 shadow-lg">
      <div className="container mx-auto flex items-center">
        <LineChart className="w-10 h-10 text-black mr-3" />
        <h1 className="text-3xl font-bold">LionsTester</h1>
      </div>
    </header>
  );
};