"use client";

import { useRouter } from "next/navigation";
import Button from "./ui/Button";

interface TicketCardProps {
  ticket: {
    _id: string;
    title: string;
    status: string;
    priority: string;
    description: string;
  };
  onClick?: () => void;
}

export default function TicketCard({ ticket, onClick }: TicketCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    router.push(`/tickets/${ticket._id}`);
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg">{ticket.title}</h3>

      <div className="flex gap-2 mt-2">
        <span className="px-2 py-1 text-xs rounded bg-gray-100 text-black">
          Estado: {ticket.status}
        </span>
        <span className="px-2 py-1 text-xs rounded bg-gray-100 text-black">
          Prioridad: {ticket.priority}
        </span>
      </div>

      <p className="text-sm mt-2 text-white">
        {ticket.description.slice(0, 100)}...
      </p>

      <div className="flex justify-end mt-4 text-white">
        <Button onClick={handleClick} className="cursor-pointer">Ver detalle</Button>
      </div>
    </div>
  );
}
