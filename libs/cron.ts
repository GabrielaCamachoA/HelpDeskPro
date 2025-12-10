import Ticket from "@/models/ticket";
import { connectDB } from "./mongodb";
import { sendMail } from "./emails";



export async function checkAndNotifyUnanswered() {
  await connectDB();
  // Tickets abiertos desde hace 48h sin assignedTo o sin actividad (ejemplo)
  const twoDaysAgo = new Date(Date.now() - 1000*60*60*24*2);
  const tickets = await Ticket.find({
    status: "open",
    createdAt: { $lte: twoDaysAgo }
  }).populate("assignedTo createdBy", "email fullname");

  for (const t of tickets) {
    if (t.assignedTo && (t as any).assignedTo.email) {
      await sendMail(
        (t as any).assignedTo.email,
        `Recordatorio: ticket pendiente - ${t.title}`,
        `<p>El ticket "<b>${t.title}</b>" está abierto desde ${t.createdAt.toISOString()}</p>`
      );
    } else if ((t as any).createdBy && (t as any).createdBy.email) {
      // si no está asignado, podríamos notificar al creador (opcional)
      await sendMail(
        (t as any).createdBy.email,
        `Su ticket sigue pendiente - ${t.title}`,
        `<p>Su ticket "<b>${t.title}</b>" sigue sin respuesta. Estamos trabajando en ello.</p>`
      );
    }
  }
}
