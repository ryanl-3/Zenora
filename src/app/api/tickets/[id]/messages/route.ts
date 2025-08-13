import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import {getServerSession} from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
    req: Request, 
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if(!session?.user?.id) {
        return NextResponse.json({error: 'Unauthorized' }, {status: 401});
    }

    const {content, parentId} = await req.json().catch(() => ({}));

    if(!content || typeof content !== 'string' || !content.trim()) {
        return NextResponse.json({ error: 'Content required'}, {status:401});
    }

    //ensure ticket is real and can assign
    const ticket = await prisma.ticket.findUnique({
        where: {id},
        select: {id:true, createdById: true, assignedToId:true},
    });
    if(!ticket){
        return NextResponse.json({ error: 'Ticket not found'}, {status: 404});
    }

    const isParticipant = 
        ticket.createdById === session.user.id || //ticket creator
        ticket.assignedToId === session.user.id || //ticket receiver
        session.user.role === 'ADMIN'; //admin

    if(!isParticipant){
        return NextResponse.json({error: 'Not allowed'}, {status: 403});
    }

    const message = await prisma.message.create({
        data: {
            content: content.trim(),
            ticketId: ticket.id,
            authorId: session.user.id,
            parentId: parentId ?? null,
        },
        include: {
            author: {select: {name: true, email:true}},
        },
    });
    return NextResponse.json(message, {status:201}); 
}