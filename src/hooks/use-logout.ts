import { signIn, useSession } from 'next-auth/react';
import { useCallback } from 'react';
import { customSignOut } from '../utils/auth/signOut';

export const useLogout = () => {
  const session = useSession();
  const handleLogout = useCallback(() => {
    if (session.data != null) {
      return customSignOut();
    } else {
      return signIn('azure-ad', {
        callbackUrl: window.location.href,
        redirect: true,
      });
    }
  }, [session]);
  return {
    session,
    handleLogout,
  };
};
