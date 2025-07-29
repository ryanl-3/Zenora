'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // or use a native <button> if no UI lib
import { useTransition } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });

    startTransition(() => {
      router.push('/login');
      router.refresh(); // refresh to clear any client state
    });
  };

  return (
    <Button onClick={handleLogout} disabled={isPending}>
      {isPending ? 'Logging out...' : 'Log out'}
    </Button>
  );
}
