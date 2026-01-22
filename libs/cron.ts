import Ticket from "@/models/ticket";
import { connectDB } from "./mongodb";
import { sendMail } from "./emails";
import { User } from "./types";



export async function checkAndNotifyUnanswered() {
  await connectDB();
  // Tickets abiertos desde hace 48h sin assignedTo o sin actividad (ejemplo)
  const twoDaysAgo = new Date(Date.now() - 1000*60*60*24*2);
  const tickets = await Ticket.find({
    status: "open",
    createdAt: { $lte: twoDaysAgo }
  }).populate("userId assignedTo", "email fullname");

  for (const t of tickets) {
    if (t.assignedTo && (t.assignedTo as User).email) {
      await sendMail(
        (t.assignedTo as User).email,
        `Recordatorio: ticket pendiente - ${t.title}`,
        `<p>El ticket "<b>${t.title}</b>" está abierto desde ${t.createdAt.toISOString()}</p>`
      );
    } else if (t.userId && (t.userId as User).email) {
      // si no está asignado, podríamos notificar al creador (opcional)
      await sendMail(
        (t.userId as User).email,
        `Su ticket sigue pendiente - ${t.title}`,
        `<p>Su ticket "<b>${t.title}</b>" sigue sin respuesta. Estamos trabajando en ello.</p>`
      );
    }
  }
}
