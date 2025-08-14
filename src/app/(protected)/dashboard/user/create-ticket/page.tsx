import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import CreateTicketForm from '@/features/tickets/CreateTicketForm';

export default async function CreateTicketPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Ticket</h1>
      <CreateTicketForm basePath="/dashboard/user" />
    </div>
  );
}