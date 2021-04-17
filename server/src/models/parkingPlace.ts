import Reservation from "./reservation";

export default class ParkingPlace {
  readonly id: number;
  readonly code: number;
  readonly ownerId?: number;

  private reservations: Reservation[];

  constructor(options: {
    id: number,
    code: number,
    ownerId: number,
  }) {
    Object.assign(this, options);

    this.reservations = [];
  }

  addReservation(reservation: Reservation): void {
    this.reservations.push(reservation);
  }

  removeReservation(reservation: Reservation): void {
    const index = this.reservations.indexOf(reservation);
    if (index !== -1) {
      this.reservations.splice(index, 1);
    }
  }

  getReservations(): Reservation[] {
    return this.reservations;
  }

  getConflicts(from: Date, to: Date): Reservation[] {
    return this.getReservations()
      .filter(reservation => reservation.conflictsWithTimeRange(from, to));
  }

  toJSON(): Object {
    return {
      id: this.code,
      ownerId: this.ownerId
    };
  }

}