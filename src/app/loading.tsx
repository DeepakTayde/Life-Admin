import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top banner skeleton */}
      <div className="h-40 rounded-3xl bg-slate-200/70 w-full" />

      {/* Metric cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-200/70 p-5" />
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="h-64 rounded-2xl bg-slate-200/70 w-full" />
    </div>
  );
}
