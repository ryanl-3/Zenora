'use client';

import { Button } from '@/components/ui/button'; // or use a native <button> if no UI lib
import {signOut} from 'next-auth/react';
import { useTransition } from 'react';


export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      signOut({ redirect: false, callbackUrl: "/login" }).then(() => {
        window.location.href = "/login"; // force redirect manually
      });
    });
  };

  return (
    <Button onClick={handleLogout} disabled={isPending}>
      {isPending ? 'Logging out..' : 'Log out'}
    </Button>
  );
}
