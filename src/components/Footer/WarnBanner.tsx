import { ReactNode } from 'react';

export const WarnBanner = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center justify-center w-full h-8 body-3 bg-semantic-warning-light text-neutral-1000">
    {children}
  </div>
);
