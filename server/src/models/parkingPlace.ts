import Reservation from "./reservation";

export default class ParkingPlace {
  readonly id: number;
  readonly code: number;
  readonly ownerId?: number;

  // Reservations by employees without fixed parking place
  private reservations: Reservation[];
  // Release by manager, that owns this parking place
  private releases: Reservation[];

  constructor(options: {
    id: number,
    code: number,
    ownerId: number,
  }) {
    Object.assign(this, options);

    this.reservations = [];
    this.releases = [];
  }

  addReservation(reservation: Reservation): void {
    this.reservations.push(reservation);
  }

  addRelease(reservation: Reservation): void {
    this.releases.push(reservation);
  }

  removeReservation(reservation: Reservation): void {
    const index = this.reservations.indexOf(reservation);
    if (index !== -1) {
      this.reservations.splice(index, 1);
    }
  }

  removeRelease(reservation: Reservation): void {
    const index = this.releases.indexOf(reservation);
    if (index !== -1) {
      this.releases.splice(index, 1);
    }
  }

  getReservations(): Reservation[] {
    return this.reservations;
  }

  getReleases(): Reservation[] {
    return this.reservations;
  }

  getConflicts(from: Date, to: Date, ignoreReservationId?: number): Reservation[] | false {
    return this.getReservations()
      .filter(reservation => {
        return reservation.conflictsWithTimeRange(from, to) && reservation.id !== ignoreReservationId;
      });
  }

  isOwnedPlace(): boolean {
    return !!this.ownerId;
  }

  toJSON(): Object {
    return {
      id: this.code,
      ownerId: this.ownerId
    };
  }

}