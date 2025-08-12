import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }
  const [sentTickets, receivedTickets] = await Promise.all([
    prisma.ticket.findMany({
    where: {createdById: session.user.id},
    orderBy: {createdAt: 'desc'},
    include: { assignedTo: { select: { email:true, name: true}}},
    }),
    prisma.ticket.findMany({
      where: {assignedToId: session.user.id},
      orderBy: {createdAt: 'desc'},
      include: { createdBy: { select: { email:true, name: true}}},
    }),
  ]);

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-4"></h1> */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Sent Tickets</h2>
        {sentTickets.length === 0 ? (
          <p className="text-gray-600">You haven’t submitted any tickets yet.</p>
        ) : (
          <ul className="space-y-4">
            {sentTickets.map((ticket) => (
              <li 
                key={ticket.id} 
                className="border p-4 rounded shadow hover:border-black hover:shadow-lg transition"
              >
                <Link href={`/tickets/${ticket.id}`} className="font-semibold text-lg">
                  <h3 className="font-semibold text-lg">
                    To {ticket.assignedTo?.name ?? ticket.assignedTo?.email ?? 'Unassigned'}
                  </h3>                
                  <h2 className="font-semibold text-lg">{ticket.title}</h2>
                  <p className="text-sm text-gray-600">{ticket.description}</p>
                  <p className="text-xs mt-2 text-gray-500">
                    Status: {ticket.status} | Created: {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">My Inbox</h2>
        {receivedTickets.length === 0 ? (
          <p className="text-gray-600">You haven’t received any tickets.</p>
        ) : (
          <ul className="space-y-4">
            {receivedTickets.map((ticket) => (
              <li 
                key={ticket.id} 
                className="border p-4 rounded shadow hover:border-black hover:shadow-lg transition"
              >
                <Link href={`/tickets/${ticket.id}`} className="font-semibold text-lg">
                  <h2 className="font-semibold text-lg">{ticket.title}</h2>
                  <p className="text-sm text-gray-600">{ticket.description}</p>
                  <p className="text-xs mt-2 text-gray-500">
                    From {ticket.createdBy?.name ?? ticket.createdBy?.email ?? 'Unknown'} · Status: {ticket.status} · Created: {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
