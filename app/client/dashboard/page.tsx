"use client";
import { AuthContext } from "@/app/components/Providers";
import TicketCard from "@/app/components/TicketCard";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useEffect, useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import api from "@/libs/api";
import { Ticket } from "@/libs/types";

export default function ClientDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { user } = useContext(AuthContext);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets");
      setTickets(res.data);
      setLoading(false);
    } catch {
      setError("Error cargando tickets");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTickets();
  }, [user]);

  const priorities = [
    { label: "Baja", value: "low" },
    { label: "Media", value: "medium" },
    { label: "Alta", value: "high" },
  ];

  const createTicket = async () => {
    setError(null);

    if (!title || !priority || !description) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        priority,
        description,
        userId: user!._id,
      }),
    });

    if (!res.ok) {
      setError("Error creando ticket");
      return;
    }

    const newTicket = await res.json();

    // agregar ticket creado al state
    setTickets((prev) => [newTicket, ...prev]);

    // limpiar formulario
    setTitle("");
    setPriority("");
    setDescription("");
  };

  return (
    <ProtectedRoute requiredRole="client">
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Mis Tickets</h1>

        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-6 text-indigo-300">
            Crear nuevo ticket
          </h2>

          {error && <Message severity="error" text={error} className="mb-3" />}

          <div className="flex flex-col gap-8">
            <span className="p-float-label">
              <InputText
                id="title"
                className="w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="title">Título del ticket</label>
            </span>

            <span className="p-float-label">
              <Dropdown
                value={priority}
                options={priorities}
                onChange={(e) => setPriority(e.value)}
                className="w-full"
              />
              <label htmlFor="priority">Prioridad</label>
            </span>

            <span className="p-float-label">
              <InputTextarea
                id="description"
                className="w-full p-inputtextarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoResize
                rows={3}
              />
              <label htmlFor="description">Descripción</label>
            </span>

            <Button
              label="Crear ticket"
              className="w-full mt-2"
              onClick={createTicket}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-white">Cargando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {tickets.length > 0 ? (
              tickets.map((t) => <TicketCard key={t._id} ticket={t} />)
            ) : (
              <p className="text-gray-300">No tienes tickets creados.</p>
            )}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
