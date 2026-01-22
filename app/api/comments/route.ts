import { sendMail } from "@/libs/emails";
import { connectDB } from "@/libs/mongodb";
import Comment from "@/models/comment";
import Ticket from "@/models/ticket";
import User from "@/models/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const ticketId = url.searchParams.get("ticketId");
  if (!ticketId) return NextResponse.json({ message: "ticketId requerido" }, { status: 400 });
  const comments = await Comment.find({ ticketId }).sort({ createdAt: 1 }).populate("userId", "fullname email role");
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  await connectDB();

  // Verificar token
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const userId = decoded.id;

  const { ticketId, message } = await req.json();
  if (!ticketId || !message) {
    return NextResponse.json({ message: "Campos faltantes" }, { status: 400 });
  }

  // crear comentario
  const comment = await Comment.create({ ticketId, userId, message });

  try {
    const ticket = await Ticket.findById(ticketId).populate(
      "userId assignedTo",
      "fullname email"
    );
    const authorUser = await User.findById(userId);

    if (authorUser && ticket) {
      const isAgent = authorUser.role === "agent";

      if (isAgent && ticket.userId?.email) {
        await sendMail(
          ticket.userId.email,
          `Respuesta en ticket: ${ticket.title}`,
          `<p>El agente respondió: ${message}</p>`
        );
      }

      if (!isAgent && ticket.assignedTo?.email) {
        await sendMail(
          ticket.assignedTo.email,
          `Nuevo comentario en ticket: ${ticket.title}`,
          `<p>Cliente escribió: ${message}</p>`
        );
      }
    }
  } catch (err) {
    console.error("Error enviando correo de notificación:", err);
  }
  return NextResponse.json(comment, { status: 201 });
}