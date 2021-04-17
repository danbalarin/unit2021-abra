import { Reservation } from "./Reservation";

export interface ReservationsResponse {
  success?: boolean;
  data: Reservation[];
}
