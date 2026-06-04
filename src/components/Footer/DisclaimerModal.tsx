'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Popup, PopUpState } from '@epam/statgpt-ui-components';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  modalContent?: string;
}

export const DisclaimerModal = ({
  isOpen,
  onClose,
  title,
  modalContent,
}: Props) => {
  return (
    <Popup
      portalId="disclaimer-modal"
      state={isOpen ? PopUpState.Opened : PopUpState.Closed}
      heading={title}
      onClose={onClose}
      containerClassName="max-w-[668px] rounded-[10px]"
    >
      {[
        <div
          key="body"
          className="body-1 flex flex-col gap-2 overflow-y-auto p-6"
        >
          {modalContent && (
            <div className="space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {modalContent}
              </ReactMarkdown>
            </div>
          )}
        </div>,
      ]}
    </Popup>
  );
};
