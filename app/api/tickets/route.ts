import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Ticket from "@/models/ticket";
import { connectDB } from "@/libs/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.title || !body.description || !body.priority || !body.userId) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    const newTicket = await Ticket.create(body);

    return NextResponse.json(newTicket, { status: 201 });

  } catch (err: unknown) {
    console.error("Error creating ticket:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectDB();

  // Verificar token
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  let decoded: { id: string; role: string };
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  const userId = decoded.id;
  const userRole = decoded.role;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");

  const filter: Record<string, unknown> = {};
  if (userRole === "client") {
    filter.userId = userId;
  }
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const tickets = await Ticket.find(filter)
    .populate("userId", "fullname email")
    .populate("assignedTo", "fullname email")
    .sort({ createdAt: -1 });

  return NextResponse.json(tickets);
}
