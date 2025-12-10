"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import api from "@/libs/api";

export default function AgentDashboard() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    let filtered = tickets;
    if (statusFilter) filtered = filtered.filter(t => t.status === statusFilter);
    if (priorityFilter) filtered = filtered.filter(t => t.priority === priorityFilter);
    if (search) filtered = filtered.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));
    setFilteredTickets(filtered);
  }, [tickets, statusFilter, priorityFilter, search]);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets");
    }
  };

  const statusOptions = [
    { label: "Todos", value: "" },
    { label: "Abierto", value: "open" },
    { label: "En Progreso", value: "in_progress" },
    { label: "Cerrado", value: "closed" },
  ];

  const priorityOptions = [
    { label: "Todos", value: "" },
    { label: "Baja", value: "low" },
    { label: "Media", value: "medium" },
    { label: "Alta", value: "high" },
  ];

  const statusBodyTemplate = (rowData: any) => {
    const statusMap: any = {
      open: "Abierto",
      in_progress: "En Progreso",
      closed: "Cerrado"
    };
    return <span className="capitalize">{statusMap[rowData.status] || rowData.status}</span>;
  };

  const priorityBodyTemplate = (rowData: any) => {
    const priorityMap: any = {
      low: "Baja",
      medium: "Media",
      high: "Alta"
    };
    return <span className="capitalize">{priorityMap[rowData.priority] || rowData.priority}</span>;
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <Button
        label="Ver Detalles"
        onClick={() => router.push(`/tickets/${rowData._id}`)}
        className="p-button-sm"
      />
    );
  };

  return (
    <ProtectedRoute requiredRole="agent">
      <main className="p-8 min-h-screen bg-gradient-to-br from-[#0f0f14] to-[#1b1b26]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-indigo-400">Panel de Agente</h1>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl shadow-2xl mb-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Dropdown
                value={statusFilter}
                options={statusOptions}
                onChange={(e) => setStatusFilter(e.value)}
                placeholder="Filtrar por Estado"
                className="w-full"
              />
              <Dropdown
                value={priorityFilter}
                options={priorityOptions}
                onChange={(e) => setPriorityFilter(e.value)}
                placeholder="Filtrar por Prioridad"
                className="w-full"
              />
              <InputText
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título o descripción"
                className="w-full"
              />
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl shadow-2xl">
            <DataTable
              value={filteredTickets}
              paginator
              rows={10}
              className="p-datatable-sm"
              emptyMessage="No hay tickets disponibles"
            >
              <Column field="title" header="Título" sortable />
              <Column field="description" header="Descripción" body={(rowData) => rowData.description.slice(0, 100) + "..."} />
              <Column field="priority" header="Prioridad" body={priorityBodyTemplate} sortable />
              <Column field="status" header="Estado" body={statusBodyTemplate} sortable />
              <Column field="userId.fullname" header="Cliente" body={(rowData) => rowData.userId?.fullname || "N/A"} />
              <Column header="Acciones" body={actionBodyTemplate} />
            </DataTable>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
