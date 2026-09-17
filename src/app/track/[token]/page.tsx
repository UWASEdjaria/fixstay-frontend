"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ticketService } from "@/services/ticket.service";
import { GuestTrackingDetails, TicketStatus } from "@/types/ticket";

const statusBadgeStyles: Record<TicketStatus, string> = {
  PENDING: "bg-urgency-medium-bg text-urgency-medium-text border-urgency-medium-border",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  ON_HOLD: "bg-orange-50 text-orange-700 border-orange-200",
  RESOLVED: "bg-urgency-low-bg text-urgency-low-text border-urgency-low-border",
  CLOSED: "bg-gray-100 text-gray-700 border-gray-200",
  CANCELLED: "bg-urgency-high-bg text-urgency-high-text border-urgency-high-border",
};

export default function GuestTrackingPage() {
  const params = useParams();
  const rawToken = params.token;
  const token = typeof rawToken === "string" ? rawToken : Array.isArray(rawToken) ? rawToken[0] : "";

  const [details, setDetails] = useState<GuestTrackingDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!token) return;
    try {
      const res = await ticketService.trackIssue(token);
      setDetails(res);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to locate ticket.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(() => {
      fetchStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-canvas p-4">
        <p className="text-brand-muted font-medium animate-pulse">Checking repair status...</p>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-canvas p-4">
        <div className="rounded-xl bg-white p-6 text-center shadow-sm border border-brand-border max-w-sm">
          <p className="font-bold text-brand-dark">Ticket Not Found</p>
          <p className="mt-1 text-sm text-brand-muted">This tracking link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-md min-h-screen bg-brand-canvas p-4 pb-12">
      <div className="mt-4 rounded-xl bg-white p-6 shadow-sm border border-brand-border/60">
        <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-brand-muted font-bold">Reference Code</span>
            <p className="font-mono text-sm font-bold text-brand-dark">{details.ticketNumber}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold border ${statusBadgeStyles[details.status] || "bg-gray-100"}`}>
            {details.status ? details.status.replace("_", " ") : "PENDING"}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent">{details.categoryName}</span>
            <span className="text-xs font-medium text-brand-muted">Room {details.roomNumber}</span>
          </div>
          <h2 className="text-lg font-bold text-brand-dark mt-1">{details.title}</h2>
          <p className="mt-1 text-sm text-brand-muted">{details.description}</p>
        </div>

        {details.resolutionSummary && (
          <div className="mt-5 rounded-lg bg-urgency-low-bg p-4 border border-urgency-low-border">
            <h3 className="text-xs font-bold text-urgency-low-text uppercase tracking-wider">Resolution Note</h3>
            <p className="mt-1 text-sm text-urgency-low-text font-medium">{details.resolutionSummary}</p>
          </div>
        )}

        <div className="mt-6 border-t border-brand-border/40 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted">Resolution Timeline</h3>
            <span className="text-[10px] text-brand-muted flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span> Live Auto-Sync
            </span>
          </div>
          <ul className="space-y-4">
            {details.timeline.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm">
                <div className="h-2.5 w-2.5 mt-1 rounded-full bg-accent flex-shrink-0" />
                <div>
                  <p className="font-bold text-brand-dark text-xs">
                    {item.newStatus ? "Status: " + item.newStatus.replace("_", " ") : "Update"}
                  </p>
                  {item.comment && <p className="text-xs text-brand-muted mt-0.5">{item.comment}</p>}
                  <span className="text-[10px] text-brand-muted/70">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
