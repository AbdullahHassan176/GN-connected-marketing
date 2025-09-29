'use client';

import { useLocale } from 'next-intl';
import { useEffect } from 'react';

export function RTLProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    // Set document direction and language
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
    
    // Add RTL class to body for CSS targeting
    if (direction === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [locale]);

  return <>{children}</>;
}
