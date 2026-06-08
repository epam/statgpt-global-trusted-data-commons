'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BannerConfig } from '../../types/banner-config';
import { DisclaimerModal } from './DisclaimerModal';

export const WarnBanner = ({
  message,
  modalTitle,
  modalContent,
}: BannerConfig) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="h4 flex min-h-10 w-full items-center justify-center bg-semantic-warning-light px-2 py-1 text-center text-neutral-900">
        <ReactMarkdown
          components={{
            a: ({ href, children }) => {
              if (href === '#popup') {
                return (
                  <button
                    type="button"
                    className="cursor-pointer text-blue-600"
                    onClick={() => setIsOpen(true)}
                  >
                    {children}
                  </button>
                );
              }
              return (
                <a
                  href={href}
                  className="text-blue-600"
                  target="_blank"
                  rel="noreferrer"
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
      <DisclaimerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={modalTitle}
        modalContent={modalContent}
      />
    </>
  );
};
