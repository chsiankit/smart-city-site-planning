import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
        Site Coordinate Not Found
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The requested smart city project route or deliverable does not exist within the project showcase.
      </p>
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-2 shadow"
        >
          <Home className="w-4 h-4" />
          <span>Return to Project Home</span>
        </Link>
        <Link
          to="/site"
          className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Site Overview</span>
        </Link>
      </div>
    </div>
  );
};
