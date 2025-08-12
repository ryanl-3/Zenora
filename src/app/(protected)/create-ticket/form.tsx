'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function CreateTicketForm() {
  const [recipientEmail, setEmailRecipient] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    
    try{
        const res = await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipientEmail, title, description }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Failed to create ticket');
          return;
        }
        router.push('/dashboard'); // or confirmation page
      } catch {
        setError('Network error. Please try again');
      }finally {
        setIsSubmitting(false);
      }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Manager Email"
        value={recipientEmail}
        onChange={(e) => setEmailRecipient(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      {error && <p className="text-red-600">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
      </Button>
    </form>
  );
}
