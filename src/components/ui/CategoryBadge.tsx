import React from 'react';
import { DocumentCategory, CATEGORY_LABELS } from '@/types/document';
import { getCategoryBadgeClass } from '@/lib/utils';
import {
  Shield,
  FileText,
  Car,
  Award,
  ShieldCheck,
  CreditCard,
  Folder,
} from 'lucide-react';

interface CategoryBadgeProps {
  category: DocumentCategory;
  showIcon?: boolean;
}

export function CategoryBadge({ category, showIcon = true }: CategoryBadgeProps) {
  const badgeClass = getCategoryBadgeClass(category);
  const label = CATEGORY_LABELS[category] || category;

  const renderIcon = () => {
    const iconClass = 'w-3.5 h-3.5 opacity-80';
    switch (category) {
      case 'IDENTITY':
        return <FileText className={iconClass} />;
      case 'INSURANCE':
        return <Shield className={iconClass} />;
      case 'VEHICLE':
        return <Car className={iconClass} />;
      case 'CERTIFICATION':
        return <Award className={iconClass} />;
      case 'WARRANTY':
        return <ShieldCheck className={iconClass} />;
      case 'SUBSCRIPTION':
        return <CreditCard className={iconClass} />;
      case 'OTHER':
      default:
        return <Folder className={iconClass} />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${badgeClass}`}
    >
      {showIcon && renderIcon()}
      <span>{label}</span>
    </span>
  );
}
