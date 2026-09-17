"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { authService } from "@/services/auth.service";
import { TicketSummary, TicketStatus, UrgencyLevel } from "@/types/ticket";
import { UserSummaryDTO } from "@/types/auth";

const urgencyColors: Record<UrgencyLevel, string> = {
  LOW: "bg-urgency-low-bg text-urgency-low-text border-urgency-low-border",
  MEDIUM: "bg-urgency-medium-bg text-urgency-medium-text border-urgency-medium-border",
  HIGH: "bg-urgency-high-bg text-urgency-high-text border-urgency-high-border",
  CRITICAL: "bg-urgency-critical-bg text-urgency-critical-text border-urgency-critical-border",
};

const KANBAN_COLUMNS: { key: TicketStatus; label: string; accent: string }[] = [
  { key: "PENDING", label: "Triage & Pending", accent: "border-amber-400" },
  { key: "IN_PROGRESS", label: "In Progress", accent: "border-blue-500" },
  { key: "RESOLVED", label: "Resolved", accent: "border-emerald-500" },
];

export default function StaffDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSummaryDTO | null>(null);
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    const token = authService.getToken();
    if (!token) return;

    try {
      const response = await apiClient.getStaffTickets(token);
      setTickets(response.data);
      setErrorMessage(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load tickets";
      setErrorMessage(message);
    }
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      const token = authService.getToken();
      const currentUser = authService.getCurrentUser();

      if (!token || !currentUser) {
        router.push("/login");
        return;
      }

      try {
        const response = await apiClient.getStaffTickets(token);
        setUser(currentUser);
        setTickets(response.data);
        setErrorMessage(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load tickets";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();

    // 10-second auto-polling for real-time ticket triage
    const interval = setInterval(() => {
      fetchTickets();
    }, 10000);

    return () => clearInterval(interval);
  }, [router, fetchTickets]);

  const handleUpdateStatus = async (ticketId: string, newStatus: TicketStatus) => {
    const token = authService.getToken();
    if (!token) return;

    setUpdatingId(ticketId);
    try {
      await apiClient.updateTicketStatus(ticketId, newStatus, token);
      await fetchTickets();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Status update failed";
      alert(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-canvas p-4">
        <p className="font-medium text-brand-muted animate-pulse">Loading maintenance board...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-canvas text-brand-dark flex flex-col font-sans">
      {/* Dashboard Topbar */}
      <header className="border-b border-brand-border/60 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-brand-dark flex items-center justify-center text-accent font-bold text-lg shadow-sm">
              S
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg text-brand-dark">StayFix Operations</span>
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span> Live 10s Sync
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-brand-dark">{user.fullName}</p>
                <p className="text-[10px] text-brand-muted uppercase font-semibold">
                  {user.role} Operations
                </p>
              </div>
            )}
            <Link
              href="/"
              className="rounded-lg border border-brand-border px-3 py-1.5 text-xs font-bold text-brand-muted hover:bg-brand-linen transition"
            >
              Guest View
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-brand-linen px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-brand-border/60 transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8">
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-urgency-high-border bg-urgency-high-bg p-4 text-xs font-semibold text-urgency-high-text">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {KANBAN_COLUMNS.map((col) => {
            const columnTickets = tickets.filter((t) => t.status === col.key);

            return (
              <div
                key={col.key}
                className="flex flex-col rounded-2xl bg-white border border-brand-border/70 p-4 shadow-xs"
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between border-b pb-3 mb-4 ${col.accent}`}>
                  <h2 className="text-sm font-bold text-brand-dark">{col.label}</h2>
                  <span className="rounded-full bg-brand-linen px-2.5 py-0.5 text-xs font-bold text-brand-muted">
                    {columnTickets.length}
                  </span>
                </div>

                {/* Column Ticket Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-220px)]">
                  {columnTickets.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-brand-border/60 p-6 text-center text-xs text-brand-muted">
                      No tickets in this column
                    </div>
                  ) : (
                    columnTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="rounded-xl border border-brand-border/60 bg-brand-canvas p-4 shadow-xs hover:border-brand-muted/40 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-brand-muted">
                            {ticket.ticketNumber}
                          </span>
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                              urgencyColors[ticket.urgency]
                            }`}
                          >
                            {ticket.urgency}
                          </span>
                        </div>

                        <div className="mt-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark">
                            <span>Room {ticket.roomNumber}</span>
                            <span className="text-brand-muted">•</span>
                            <span className="text-accent">{ticket.categoryName}</span>
                          </div>
                          <h3 className="mt-1 text-sm font-bold text-brand-dark">{ticket.title}</h3>
                          <p className="mt-1 text-xs text-brand-muted line-clamp-2">{ticket.description}</p>
                          {ticket.reportedByGuestName && (
                            <p className="mt-2 text-[11px] text-brand-muted font-medium">
                              Guest: <span className="text-brand-dark font-semibold">{ticket.reportedByGuestName}</span>
                            </p>
                          )}
                        </div>

                        {/* Status Action Buttons */}
                        <div className="mt-4 pt-3 border-t border-brand-border/40 flex items-center justify-between gap-2">
                          {col.key === "PENDING" && (
                            <button
                              onClick={() => handleUpdateStatus(ticket.id, "IN_PROGRESS")}
                              disabled={updatingId === ticket.id}
                              className="w-full rounded-lg bg-brand-dark py-1.5 text-xs font-bold text-white hover:bg-brand-surface transition disabled:opacity-50 cursor-pointer"
                            >
                              {updatingId === ticket.id ? "Updating..." : "Start Repair"}
                            </button>
                          )}

                          {col.key === "IN_PROGRESS" && (
                            <div className="grid grid-cols-2 gap-2 w-full">
                              <button
                                onClick={() => handleUpdateStatus(ticket.id, "PENDING")}
                                disabled={updatingId === ticket.id}
                                className="rounded-lg border border-brand-border py-1.5 text-xs font-bold text-brand-muted hover:bg-brand-linen transition disabled:opacity-50 cursor-pointer"
                              >
                                Revert
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(ticket.id, "RESOLVED")}
                                disabled={updatingId === ticket.id}
                                className="rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
                              >
                                {updatingId === ticket.id ? "..." : "Resolve"}
                              </button>
                            </div>
                          )}

                          {col.key === "RESOLVED" && ticket.guestTrackingToken && (
                            <Link
                              href={`/track/${ticket.guestTrackingToken}`}
                              target="_blank"
                              className="w-full text-center rounded-lg border border-brand-border py-1.5 text-xs font-bold text-accent hover:bg-accent-tint transition"
                            >
                              View Live Tracker &rarr;
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}