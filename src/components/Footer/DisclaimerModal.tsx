'use client';

import { Popup, PopUpState } from '@epam/statgpt-ui-components';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  body?: string;
  sectionTitle?: string;
  p1?: string;
  p2?: string;
  p3?: string;
}

export const DisclaimerModal = ({
  isOpen,
  onClose,
  title,
  body,
  sectionTitle,
  p1,
  p2,
  p3,
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
          {body && <p>{body}</p>}
          {sectionTitle && <p className="h2 mt-3">{sectionTitle}</p>}
          {p1 && <p>{p1}</p>}
          {p2 && <p>{p2}</p>}
          {p3 && <p>{p3}</p>}
        </div>,
      ]}
    </Popup>
  );
};
