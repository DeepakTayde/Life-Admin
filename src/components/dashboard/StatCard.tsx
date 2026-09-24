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
          topBorder: 'border-t-4 border-t-[#d97706]',
          iconBg: 'bg-[#d97706]/10 text-[#d97706]',
          valueColor: 'text-[#d97706]',
          badgeText: 'Action in ≤ 30 Days',
          badgeBg: 'bg-[#d97706]/15 text-[#b45309]',
        };
      case 'danger':
        return {
          topBorder: 'border-t-4 border-t-[#c62828]',
          iconBg: 'bg-[#c62828]/10 text-[#c62828]',
          valueColor: 'text-[#c62828]',
          badgeText: 'Action Required',
          badgeBg: 'bg-[#c62828]/15 text-[#991b1b]',
        };
      case 'success':
        return {
          topBorder: 'border-t-4 border-t-[#2e7d32]',
          iconBg: 'bg-[#2e7d32]/10 text-[#2e7d32]',
          valueColor: 'text-[#2e7d32]',
          badgeText: 'Verified & Active',
          badgeBg: 'bg-[#2e7d32]/15 text-[#1b5e20]',
        };
      case 'default':
      default:
        return {
          topBorder: 'border-t-4 border-t-[#0b3b60]',
          iconBg: 'bg-[#0b3b60]/10 text-[#0b3b60]',
          valueColor: 'text-[#0b3b60]',
          badgeText: 'National Registry',
          badgeBg: 'bg-[#0b3b60]/10 text-[#0b3b60]',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`bg-white rounded-lg border border-[#dcdcdc] p-4 sm:p-5 shadow-xs transition hover:shadow-md ${styles.topBorder}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${styles.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className={`text-3xl sm:text-4xl font-black tracking-tight ${styles.valueColor}`}>
          {value}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${styles.badgeBg}`}>
          {styles.badgeText}
        </span>
      </div>

      <p className="mt-2 text-[11px] text-slate-500 font-medium border-t border-slate-100 pt-2">
        {subtitle}
      </p>
    </div>
  );
}
