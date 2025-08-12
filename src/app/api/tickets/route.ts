import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { recipientEmail, title, description } = body;

  if (!title || !description) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  //allow unassigned tickets for no email
  let assignedToId: string | null = null;

  if (recipientEmail && recipientEmail.trim() !== '') {
    const normalizedEmail = recipientEmail.trim().toLowerCase();

    const assignee = await prisma.user.findUnique({
      where: { email: normalizedEmail},
      select: {id: true, role: true},
    });

    if(!assignee){
      return NextResponse.json({ error: 'Recipient not found'}, {status: 400});
    }
    assignedToId = assignee.id;
  }

  try {
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        createdById: session.user.id,
        status: 'OPEN',
        assignedToId: assignedToId ?? null,
      },
      include: {
        createdBy: {select: {email: true, name: true}},
        assignedTo: {select: { email: true, name: true}},
      },
    });

    console.log("Created ticket:", {
      id: ticket.id,
      assignedToId: ticket.assignedToId,
      assignedTo: ticket.assignedTo,   // should show the email you typed
      createdById: ticket.createdById,
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
