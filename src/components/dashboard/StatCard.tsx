import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  variant?: 'default' | 'warning' | 'danger' | 'success';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}: StatCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          bg: 'bg-amber-50/60 border-amber-200/80',
          iconBg: 'bg-amber-100 text-amber-700',
          textColor: 'text-amber-950',
          valueColor: 'text-amber-700',
        };
      case 'danger':
        return {
          bg: 'bg-rose-50/60 border-rose-200/80',
          iconBg: 'bg-rose-100 text-rose-700',
          textColor: 'text-rose-950',
          valueColor: 'text-rose-700',
        };
      case 'success':
        return {
          bg: 'bg-emerald-50/60 border-emerald-200/80',
          iconBg: 'bg-emerald-100 text-emerald-700',
          textColor: 'text-emerald-950',
          valueColor: 'text-emerald-700',
        };
      case 'default':
      default:
        return {
          bg: 'bg-white border-slate-200/90',
          iconBg: 'bg-indigo-50 text-indigo-700',
          textColor: 'text-slate-900',
          valueColor: 'text-slate-900',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 shadow-xs transition hover:shadow-md ${styles.bg}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${styles.valueColor}`}>
          {value}
        </span>
        <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}
