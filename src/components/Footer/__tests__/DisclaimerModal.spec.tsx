// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { DisclaimerModal } from '../DisclaimerModal';

vi.mock('@epam/statgpt-ui-components', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Popup: ({ children, state }: { children: any; state: string }) =>
    state === 'opened' ? <div data-testid="popup">{children}</div> : null,
  PopUpState: { Opened: 'opened', Closed: 'closed' },
}));

describe('DisclaimerModal', () => {
  it('renders nothing when closed', () => {
    render(
      <DisclaimerModal
        isOpen={false}
        onClose={() => {}}
        modalContent={'## Title\n\nSome text.'}
      />,
    );
    expect(screen.queryByTestId('popup')).toBeNull();
  });

  it('renders markdown headings as h2 elements when open', () => {
    render(
      <DisclaimerModal
        isOpen={true}
        onClose={() => {}}
        modalContent={'## Disclaimer\n\nSome paragraph.'}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Disclaimer' })).toBeInTheDocument();
  });

  it('renders markdown paragraphs as p elements when open', () => {
    render(
      <DisclaimerModal
        isOpen={true}
        onClose={() => {}}
        modalContent="Some paragraph text."
      />,
    );
    expect(screen.getByText('Some paragraph text.')).toBeInTheDocument();
  });

  it('renders nothing inside popup when modalContent is undefined', () => {
    render(
      <DisclaimerModal isOpen={true} onClose={() => {}} />,
    );
    expect(screen.getByTestId('popup')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).toBeNull();
  });
});
