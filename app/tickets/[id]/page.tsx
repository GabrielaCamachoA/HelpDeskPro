"use client";
import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthContext } from "@/app/components/Providers";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";

import api from "@/libs/api";

export default function TicketDetail() {
  const params = useParams();
  const id = params.id as string;
  const [ticket, setTicket] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    fetchTicket();
    fetchComments();
  }, [id, user]);

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data);
      setStatus(res.data.status);
    } catch (err) {
      setError("Error cargando ticket");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments?ticketId=${id}`);
      setComments(res.data);
    } catch (err) {
      setError("Error cargando comentarios");
    }
  };

  const sendComment = async () => {
  if (!text.trim()) return;

  try {
    await api.post("/comments", {
      ticketId: id,
      message: text,
    });

    setText("");
    await fetchComments();
    setError(null);
  } catch (err) {
    console.log(err);
    setError("Error enviando comentario");
  }
};



  const changeStatus = async () => {
    try {
      await api.patch(`/tickets/${id}`, { status });
      setTicket({ ...ticket, status });
    } catch (err) {
      setError("Error cambiando estado");
    }
  };

  const statusOptions = [
    { label: "Abierto", value: "open" },
    { label: "En Progreso", value: "in_progress" },
    { label: "Cerrado", value: "closed" },
  ];

  if (!ticket) return <div className="flex justify-center items-center h-screen"><p>Cargando...</p></div>;

  const isAgent = user?.role === "agent";
  const isOwner = ticket.userId._id === user?.id;

  return (
    <ProtectedRoute requiredRole={isAgent ? "agent" : "client"}>
      <main className="p-8 min-h-screen bg-gradient-to-br from-[#0f0f14] to-[#1b1b26]">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <Button
            label="← Regresar"
            className="mb-4"
            onClick={() => router.push(isAgent ? "/agent/dashboard" : "/client/dashboard")}
          />
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl shadow-2xl mb-6">
            <h1 className="text-3xl font-bold mb-4 text-indigo-400">{ticket.title}</h1>
            <p className="text-gray-300 mb-4">{ticket.description}</p>
            <p className="text-sm text-gray-400">Prioridad: <span className="capitalize">{ticket.priority}</span></p>
            <p className="text-sm text-gray-400">Estado: <span className="capitalize">{ticket.status.replace("_", " ")}</span></p>
            <p className="text-sm text-gray-400">Creado por: {ticket.userId.fullname}</p>
            {ticket.assignedTo && <p className="text-sm text-gray-400">Asignado a: {ticket.assignedTo.fullname}</p>}

            {isAgent && (
              <div className="mt-4">
                <Dropdown
                  value={status}
                  options={statusOptions}
                  onChange={(e) => setStatus(e.value)}
                  className="w-full mb-2"
                />
                <Button label="Cambiar Estado" onClick={changeStatus} className="w-full" />
              </div>
            )}
          </Card>

          {error && <Message severity="error" text={error} className="mb-4" />}

          <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300">Comentarios</h2>
            <div className="space-y-4 mb-4">
              {comments.map((c) => (
                <div key={c._id} className="p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-400">{c.userId.fullname} ({c.userId.role})</p>
                  <p className="text-white">{c.message}</p>
                  <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <InputTextarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe un comentario..."
                rows={3}
                className="w-full"
              />
              <Button label="Enviar Comentario" onClick={sendComment} className="w-full" />
            </div>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  );
}
