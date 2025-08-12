'use client';

import {useState, useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ReplyForm({ticketId, canReply}: {ticketId: string; canReply: boolean}){
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [pending, start] = useTransition();

    if(!canReply) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        start(async () => {
            const res = await fetch(`/api/tickets/${ticketId}/messages`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ content }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.error || 'failed to send');
                return;
            }
            setContent('');
            //means we show the reply button
            setOpen(false);
            window.location.reload();
        });
    };

    return open ? (
        <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
        >
        <Textarea
            placeholder="Write your reply..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full"
        />
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
            Send
            </Button>
        </div>
        </form>
    ) : (
        <Button onClick={() => setOpen(true)}>Reply</Button>
    );
}