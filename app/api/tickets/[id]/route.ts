import { sendMail } from "@/libs/emails";
import { connectDB } from "@/libs/mongodb";
import Ticket from "@/models/ticket";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const ticket = await Ticket.findById(id).populate("userId assignedTo", "fullname email role");
  if (!ticket) return NextResponse.json({ message: "No encontrado" }, { status: 404 });
  return NextResponse.json(ticket);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const updates = await req.json();
  const ticket = await Ticket.findByIdAndUpdate(id, updates, { new: true }).populate("userId assignedTo", "fullname email role");
  if (!ticket) return NextResponse.json({ message: "No encontrado" }, { status: 404 });

  // notificaciones importantes
  if (updates.assignedTo && ticket.assignedTo && (ticket.assignedTo as any).email) {
    await sendMail((ticket.assignedTo as any).email, `Se te asignó el ticket: ${ticket.title}`, `<p>Se te asignó el ticket <b>${ticket.title}</b>.</p>`);
  }
  if (updates.status === "closed" && (ticket.userId as any).email) {
    await sendMail((ticket.userId as any).email, `Ticket cerrado: ${ticket.title}`, `<p>Tu ticket <b>${ticket.title}</b> ha sido cerrado.</p>`);
  }

  return NextResponse.json(ticket);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const ticket = await Ticket.findByIdAndDelete(id);
  if (!ticket) return NextResponse.json({ message: "No encontrado" }, { status: 404 });
  return NextResponse.json({ message: "Eliminado" });
}
