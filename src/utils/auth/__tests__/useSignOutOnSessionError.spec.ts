// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSignOutOnSessionError } from '../useSignOutOnSessionError';

const mockUseSession = vi.fn();
const mockCustomSignOut = vi.fn();

vi.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
}));

vi.mock('../signOut', () => ({
  customSignOut: (...args: unknown[]) => mockCustomSignOut(...args),
}));

describe('useSignOutOnSessionError', () => {
  beforeEach(() => {
    mockUseSession.mockReset();
    mockCustomSignOut.mockReset().mockResolvedValue(undefined);
  });

  it('does not call customSignOut when the session has no error', () => {
    mockUseSession.mockReturnValue({ data: { user: {} } });

    renderHook(() => useSignOutOnSessionError());

    expect(mockCustomSignOut).not.toHaveBeenCalled();
  });

  it('does not call customSignOut while the session is still loading', () => {
    mockUseSession.mockReturnValue({ data: undefined });

    renderHook(() => useSignOutOnSessionError());

    expect(mockCustomSignOut).not.toHaveBeenCalled();
  });

  it('calls customSignOut once the session carries a RefreshTokenExpired error', () => {
    mockUseSession.mockReturnValue({
      data: { user: {}, error: 'RefreshTokenExpired' },
    });

    renderHook(() => useSignOutOnSessionError());

    expect(mockCustomSignOut).toHaveBeenCalledTimes(1);
  });

  it('does not call customSignOut for a transient RefreshAccessTokenError — it should self-heal on the next refresh', () => {
    mockUseSession.mockReturnValue({
      data: { user: {}, error: 'RefreshAccessTokenError' },
    });

    renderHook(() => useSignOutOnSessionError());

    expect(mockCustomSignOut).not.toHaveBeenCalled();
  });

  it('only calls customSignOut once across re-renders with the same error', () => {
    mockUseSession.mockReturnValue({
      data: { user: {}, error: 'RefreshTokenExpired' },
    });

    const { rerender } = renderHook(() => useSignOutOnSessionError());
    rerender();
    rerender();

    expect(mockCustomSignOut).toHaveBeenCalledTimes(1);
  });
});
