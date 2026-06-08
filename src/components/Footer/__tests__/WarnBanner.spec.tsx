// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { WarnBanner } from '../WarnBanner';

vi.mock('@epam/statgpt-ui-components', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Popup: ({ children, state }: { children: any; state: string }) =>
    state === 'opened' ? <div data-testid="popup">{children}</div> : null,
  PopUpState: { Opened: 'opened', Closed: 'closed' },
}));

describe('WarnBanner', () => {
  it('renders the plain message text', () => {
    render(<WarnBanner message="System is under maintenance." />);
    expect(
      screen.getByText('System is under maintenance.'),
    ).toBeInTheDocument();
  });

  it('renders a mailto link as an anchor element', () => {
    render(
      <WarnBanner message="Contact [support](mailto:support@example.com) for help." />,
    );
    const link = screen.getByRole('link', { name: 'support' });
    expect(link).toHaveAttribute('href', 'mailto:support@example.com');
    expect(link.tagName).toBe('A');
  });

  it('renders a #popup link as a button', () => {
    render(
      <WarnBanner
        message="For details, [click here](#popup)."
        modalTitle="Details"
        modalContent="Some content."
      />,
    );
    const button = screen.getByRole('button', { name: 'click here' });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('opens the modal when the #popup button is clicked', () => {
    render(
      <WarnBanner
        message="For details, [click here](#popup)."
        modalTitle="Details"
        modalContent="Some content."
      />,
    );
    expect(screen.queryByTestId('popup')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'click here' }));
    expect(screen.getByTestId('popup')).toBeInTheDocument();
  });

  it('opens an empty modal when #popup is clicked but no modal content is configured', () => {
    render(<WarnBanner message="For details, [click here](#popup)." />);
    fireEvent.click(screen.getByRole('button', { name: 'click here' }));
    expect(screen.getByTestId('popup')).toBeInTheDocument();
  });

  it('renders both a mailto link and a #popup button in the same message', () => {
    render(
      <WarnBanner
        message="Please [report issue](mailto:help@example.com). For more, [click here](#popup)."
        modalTitle="More info"
      />,
    );
    expect(screen.getByRole('link', { name: 'report issue' })).toHaveAttribute(
      'href',
      'mailto:help@example.com',
    );
    expect(
      screen.getByRole('button', { name: 'click here' }),
    ).toBeInTheDocument();
  });
});
