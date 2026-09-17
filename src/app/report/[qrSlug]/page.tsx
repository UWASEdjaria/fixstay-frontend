"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ticketService } from "@/services/ticket.service";
import { CategoryOption, RoomDetails, UrgencyLevel, CreateTicketPayload } from "@/types/ticket";

const URGENCY_LEVELS: UrgencyLevel[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function ReportIssuePage() {
  const router = useRouter();
  const params = useParams();
  const rawSlug = params.qrSlug;
  const qrSlug = typeof rawSlug === "string" ? rawSlug : Array.isArray(rawSlug) ? rawSlug[0] : "";

  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [urgency, setUrgency] = useState<UrgencyLevel>("MEDIUM");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      if (!qrSlug) {
        setErrorMessage("Missing room QR code.");
        setLoading(false);
        return;
      }
      try {
        const [rm, cats] = await Promise.all([
          ticketService.getRoom(qrSlug),
          ticketService.getCategories(),
        ]);
        setRoom(rm);
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCategory(cats[0].id);
          setUrgency(cats[0].defaultUrgency);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load room details.";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [qrSlug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!room) return;

    setSubmitting(true);
    setErrorMessage(null);

    const payload: CreateTicketPayload = {
      roomId: room.id,
      categoryId: selectedCategory,
      title: title.trim(),
      description: description.trim(),
      urgency,
      reportedByGuestName: guestName.trim().length > 0 ? guestName.trim() : undefined,
    };

    try {
      const created = await ticketService.reportIssue(payload);
      if (created.guestTrackingToken) {
        router.push(`/track/${created.guestTrackingToken}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit request.";
      setErrorMessage(message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-canvas p-4">
        <p className="text-brand-muted font-medium animate-pulse">Loading room details...</p>
      </div>
    );
  }

  if (errorMessage && !room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-canvas p-4">
        <div className="rounded-xl bg-white p-6 text-center shadow-sm border border-brand-border max-w-sm">
          <h2 className="text-lg font-bold text-brand-dark">Invalid Room Code</h2>
          <p className="mt-2 text-sm text-brand-muted">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-lg min-h-screen bg-brand-canvas p-4 pb-12">
      <header className="mb-6 mt-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">StayFix Hospitality</span>
        <h1 className="text-2xl font-bold tracking-tight text-brand-dark mt-1">Report a Room Issue</h1>
        {room && (
          <p className="mt-1 text-sm text-brand-muted">
            Room <span className="font-bold text-brand-dark">{room.roomNumber}</span> • {room.building} (Floor {room.floor})
          </p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm border border-brand-border/60">
        {errorMessage && (
          <div className="rounded-lg bg-urgency-high-bg p-3 text-sm text-urgency-high-text border border-urgency-high-border">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">Issue Category</label>
          <select
            value={selectedCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const catId = e.target.value;
              setSelectedCategory(catId);
              const found = categories.find((c) => c.id === catId);
              if (found) setUrgency(found.defaultUrgency);
            }}
            className="mt-1 block w-full rounded-lg border border-brand-border bg-white p-3 text-sm text-brand-dark focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">Urgency Level</label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {URGENCY_LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setUrgency(lvl)}
                className={`rounded-lg py-2.5 text-xs font-bold transition ${
                  urgency === lvl
                    ? "bg-accent text-white shadow-sm"
                    : "bg-brand-linen text-brand-muted hover:bg-brand-border/40"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">Problem Summary</label>
          <input
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="e.g. AC blowing warm air"
            className="mt-1 block w-full rounded-lg border border-brand-border p-3 text-sm text-brand-dark focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">Details</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Please describe the issue..."
            className="mt-1 block w-full rounded-lg border border-brand-border p-3 text-sm text-brand-dark focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">Your Name (Optional)</label>
          <input
            type="text"
            value={guestName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGuestName(e.target.value)}
            placeholder="e.g. Mr. Smith"
            className="mt-1 block w-full rounded-lg border border-brand-border p-3 text-sm text-brand-dark focus:border-accent focus:ring-1 focus:ring-accent outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-lg bg-accent py-3.5 text-sm font-bold text-white shadow hover:bg-accent-hover disabled:opacity-50 transition"
        >
          {submitting ? "Sending Request..." : "Submit Maintenance Request"}
        </button>
      </form>
    </main>
  );
}
