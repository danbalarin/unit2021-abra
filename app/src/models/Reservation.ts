export interface Reservation {
  id?: number;
  from: Date;
  to: Date;
  parkingSpotId: number;
  username: string;
}
