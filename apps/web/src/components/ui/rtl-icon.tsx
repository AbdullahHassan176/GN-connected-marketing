'use client';

import { useLocale } from 'next-intl';
import { LucideIcon } from 'lucide-react';
import { cn } from '@repo/ui';

interface RTLIconProps {
  icon: LucideIcon;
  className?: string;
  flip?: boolean;
}

export function RTLIcon({ icon: Icon, className, flip = true }: RTLIconProps) {
  const locale = useLocale();
  const shouldFlip = flip && locale === 'ar';

  return (
    <Icon 
      className={cn(
        shouldFlip && 'transform scale-x-[-1]',
        className
      )} 
    />
  );
}
