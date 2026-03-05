import { ReactNode } from 'react';

export const WarnBanner = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center justify-center text-center w-full min-h-10 px-2 py-1 h4 bg-semantic-warning-light text-neutral-900">
    {children}
  </div>
);
