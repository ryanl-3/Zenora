'use client';

import { Button } from '@/components/ui/button'; // or use a native <button> if no UI lib
import {signOut} from 'next-auth/react';
import { useTransition } from 'react';


export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();


  const handleLogout = () => {
    startTransition(() => {
      signOut({
        callbackUrl: "/login", //redirect after logout
      });
    });
  };

  return (
    <Button onClick={handleLogout} disabled={isPending}>
      {isPending ? 'Logging out..' : 'Log out'}
    </Button>
  );
}
