import prisma from '@/lib/prisma';
import {redirect} from 'next/navigation';
import {authOptions} from '@/app/api/auth/[...nextauth]/route';
import {getServerSession} from 'next-auth';
import ReplyForm from './reply-form'

export default async function TicketPage({params}: {params: Promise<{ id: string }>;}) {
    const {id} = await params;
    const session = await getServerSession(authOptions);
    if(!session) redirect('/login');

    const ticket = await prisma.ticket.findUnique({
        where: {id},
        include: {
            createdBy: { select: { email: true, name: true}},
            assignedTo: { select: {email: true, name: true}},
            messages: {
                orderBy: {createdAt: 'asc'},
                include: {author: {select: {name: true, email: true}}},
            },
        },
    });

    if(!ticket) {
        return (
        <div className="flex justify-center mt-10">
            <div className="bg-red-100 text-red-700 p-4 rounded shadow w-full max-w-lg">
            Ticket not found.
            </div>
        </div>
        );
    }

    const canView =
        session.user.role === 'ADMIN' ||
        ticket.createdById === session.user.id ||
        ticket.assignedToId === session.user.id;
    
    if (!canView){
        return (
        <div className="flex justify-center mt-10">
            <div className="bg-red-100 text-red-700 p-4 rounded shadow w-full max-w-lg">
            You don't have access.
            </div>
        </div>
        );
    }

    const replyDisabled = ticket.status === 'CLOSED' || ticket.status === 'RESOLVED';


    return (
    <div className="flex flex-col items-center mt-10 px-4 gap-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl border-2 border-gray-300">
            <div>
                <h1 className="text-2xl font-bold mb-4">{ticket.title}</h1>        
                <div className="text-sm text-gray-500 space-y-1">
                    <p><strong>From:</strong> {ticket.createdBy?.name ?? ticket.createdBy?.email ?? 'Unknown'}</p>
                    <p><strong>To:</strong> {ticket.assignedTo?.name ?? ticket.assignedTo?.email ?? 'Unassigned'}</p>
                    <p><strong>Status:</strong> {ticket.status}</p>
                    <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-gray-600 text-med mb-4">{ticket.description}</p>
            </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl border-2 border-gray-300">
            <section>
                <h2 className="font-semibold mb-2">Responses</h2>
                {ticket.messages.length === 0 ? (
                    <p className="text-gray-500 text-sm">No messages yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {ticket.messages.map((m) => (
                            <li key={m.id} className="border rounded p-3">
                                <div className="text-sm text-gray-500 mb-1">
                                    {m.author.name ?? m.author.email} · {new Date(m.createdAt).toLocaleString()}
                                </div>
                                <div className="whitespace-pre-wrap">{m.content}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
        <div className="bg-white shadow-md rounded-lg p-3 w-full max-w-2xl border-2 border-gray-300">
            <ReplyForm ticketId={ticket.id} canReply={!replyDisabled} />
        </div>
    </div>
    )
}