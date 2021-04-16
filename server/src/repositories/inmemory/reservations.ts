import Reservation from "../../models/reservation";

export default class ReservationsRepository {
  private storage: {[id: number]: Reservation};
  
  constructor() {
    this.storage = {};
  }

  async findById(id: number): Promise<Reservation | null> {
    return this.storage[id];
  }

  async findAll(): Promise<Reservation[]> {
    return Object.values(this.storage);
  }

  async insert(reservation: Reservation): Promise<void> {
    this.storage[reservation.id] = reservation;
  }
}