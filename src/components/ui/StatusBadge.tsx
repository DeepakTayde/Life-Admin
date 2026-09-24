import React from 'react';
import { DocumentStatus } from '@/types/document';
import { getStatusBadgeConfig } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, AlertOctagon, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: DocumentStatus;
  daysUntilExpiry?: number | null;
  showDays?: boolean;
}

export function StatusBadge({ status, daysUntilExpiry, showDays = false }: StatusBadgeProps) {
  const config = getStatusBadgeConfig(status);

  const renderIcon = () => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />;
      case 'EXPIRING_SOON':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />;
      case 'EXPIRED':
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />;
      case 'NO_EXPIRY':
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.badgeClass}`}
      role="status"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} aria-hidden="true" />
      {renderIcon()}
      <span>{config.label}</span>
      {showDays && daysUntilExpiry !== null && daysUntilExpiry !== undefined && (
        <span className="opacity-75 text-[11px] ml-0.5">
          ({daysUntilExpiry < 0 ? `${Math.abs(daysUntilExpiry)}d ago` : `${daysUntilExpiry}d left`})
        </span>
      )}
    </span>
  );
}
