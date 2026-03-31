import { ReactNode } from 'react';

export const WarnBanner = ({ children }: { children: ReactNode }) => (
  <div className="h4 flex min-h-10 w-full items-center justify-center bg-semantic-warning-light px-2 py-1 text-center text-neutral-900">
    {children}
  </div>
);
