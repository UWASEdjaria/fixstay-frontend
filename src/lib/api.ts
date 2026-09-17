import {
  CategoryOption,
  RoomDetails,
  CreateTicketPayload,
  TicketSummary,
  GuestTrackingDetails,
  TicketStatus,
} from "../types/ticket";

const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody: { message?: string } = await response.json().catch(() => ({}));
    throw new Error(errorBody.message ?? `HTTP request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const apiClient = {
  // 1. Resolve room from QR code slug
  async getRoomBySlug(qrSlug: string): Promise<RoomDetails> {
    const res = await fetch(`${API_BASE_URL}/rooms/lookup/${qrSlug}`, { cache: "no-store" });
    return handleResponse<RoomDetails>(res);
  },

  // 2. Fetch categories for form dropdown
  async getCategories(): Promise<CategoryOption[]> {
    const res = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 300 } });
    return handleResponse<CategoryOption[]>(res);
  },

  // 3. Submit a new ticket
  async submitTicket(payload: CreateTicketPayload): Promise<TicketSummary> {
    const res = await fetch(`${API_BASE_URL}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse<TicketSummary>(res);
  },

  // 4. Track ticket by secret token
  async trackTicket(token: string): Promise<GuestTrackingDetails> {
    const res = await fetch(`${API_BASE_URL}/tickets/track/${token}`, { cache: "no-store" });
    return handleResponse<GuestTrackingDetails>(res);
  },

  // 5. Staff: Fetch all tickets
  async getStaffTickets(token: string, status?: TicketStatus): Promise<{ data: TicketSummary[] }> {
    const query = status ? `?status=${status}` : "";
    const res = await fetch(`${API_BASE_URL}/tickets${query}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return handleResponse<{ data: TicketSummary[] }>(res);
  },

  // 6. Staff: Update ticket status
  async updateTicketStatus(
    ticketId: string,
    status: TicketStatus,
    token: string,
    resolutionSummary?: string
  ): Promise<TicketSummary> {
    const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, resolutionSummary }),
    });
    return handleResponse<TicketSummary>(res);
  },
};
