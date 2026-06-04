'use client';

import { useState } from 'react';
import { BannerConfig } from '../../types/banner-config';
import { DisclaimerModal } from './DisclaimerModal';

export const WarnBanner = ({
  message,
  linkText,
  modalTitle,
  modalContent,
}: BannerConfig) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="h4 flex min-h-10 w-full items-center justify-center bg-semantic-warning-light px-2 py-1 text-center text-neutral-900">
        <span>
          {message}{' '}
          {linkText && (
            <button
              className="cursor-pointer text-blue-600"
              onClick={() => setIsOpen(true)}
            >
              {linkText}
            </button>
          )}
        </span>
      </div>
      {linkText && (
        <DisclaimerModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={modalTitle}
          modalContent={modalContent}
        />
      )}
    </>
  );
};
