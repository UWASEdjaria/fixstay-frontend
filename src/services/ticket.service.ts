import { apiClient } from "@/lib/api";
import {
  CategoryOption,
  RoomDetails,
  CreateTicketPayload,
  TicketSummary,
  GuestTrackingDetails,
} from "@/types/ticket";

export class FrontendTicketService {
  /**
   * Resolves room details from the QR slug.
   */
  public async getRoom(qrSlug: string): Promise<RoomDetails> {
    if (!qrSlug || qrSlug.trim().length === 0) {
      throw new Error("Invalid room code.");
    }
    return apiClient.getRoomBySlug(qrSlug.trim());
  }

  /**
   * Fetches available maintenance categories for the dropdown.
   */
  public async getCategories(): Promise<CategoryOption[]> {
    const categories = await apiClient.getCategories();
    if (!categories || categories.length === 0) {
      throw new Error("No maintenance categories currently available.");
    }
    return categories;
  }

  /**
   * Submits an issue report after validating required fields.
   */
  public async reportIssue(payload: CreateTicketPayload): Promise<TicketSummary> {
    if (!payload.title || payload.title.trim().length === 0) {
      throw new Error("Please provide a summary of the issue.");
    }
    if (!payload.description || payload.description.trim().length === 0) {
      throw new Error("Please describe the problem details.");
    }
    return apiClient.submitTicket(payload);
  }

  /**
   * Retrieves live guest tracking details.
   */
  public async trackIssue(token: string): Promise<GuestTrackingDetails> {
    if (!token || token.trim().length === 0) {
      throw new Error("Invalid tracking link.");
    }
    return apiClient.trackTicket(token.trim());
  }
}

export const ticketService = new FrontendTicketService();
