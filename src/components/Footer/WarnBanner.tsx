import { ReactNode } from 'react';

export const WarnBanner = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center justify-center w-full h-10 h4 bg-semantic-warning-light text-neutral-900">
    {children}
  </div>
);
