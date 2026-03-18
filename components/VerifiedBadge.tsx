import React from 'react';
import { Check } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md';
  className?: string;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };
  const iconSize = {
    sm: 10,
    md: 12,
  };

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full bg-[#1DA1F2] shrink-0
        ${sizeClasses[size]}
        ${className}
      `}
      title="Verified Account"
    >
      <Check strokeWidth={3} className="text-white" size={iconSize[size]} />
    </div>
  );
};

export default VerifiedBadge;
