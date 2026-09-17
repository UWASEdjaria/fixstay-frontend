export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type TicketStatus = "PENDING" | "IN_PROGRESS" | "ON_HOLD" | "RESOLVED" | "CLOSED" | "CANCELLED";

export interface CategoryOption {
  id: string;
  name: string;
  description: string | null;
  defaultUrgency: UrgencyLevel;
}

export interface RoomDetails {
  id: string;
  roomNumber: string;
  floor: number;
  building: string;
  status: string;
}

export interface CreateTicketPayload {
  roomId: string;
  categoryId: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  reportedByGuestName?: string;
  guestContact?: string;
}

export interface TicketSummary {
  id: string;
  ticketNumber: string;
  roomId: string;
  roomNumber: string;
  floor: number;
  building: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  status: TicketStatus;
  reportedByGuestName: string | null;
  guestTrackingToken: string | null;
  assignedStaff: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicTimelineEntry {
  newStatus: TicketStatus | null;
  comment: string | null;
  createdAt: string;
}

export interface GuestTrackingDetails {
  ticketNumber: string;
  roomNumber: string;
  categoryName: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  status: TicketStatus;
  createdAt: string;
  resolvedAt: string | null;
  resolutionSummary: string | null;
  timeline: PublicTimelineEntry[];
}
