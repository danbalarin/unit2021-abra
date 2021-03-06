import Reservation from "../../models/reservation";

export default class ReservationsRepository {
  private storage: {[id: number]: Reservation};
  
  constructor() {
    this.storage = {};
  }

  async findById(id: number): Promise<Reservation | null> {
    return this.storage[id] ?? null;
  }

  async findByUserId(userId: number): Promise<Reservation[]> {
    return Object.values(this.storage).filter(reservation => reservation.user.id === userId);
  }

  async findAll(): Promise<Reservation[]> {
    return Object.values(this.storage);
  }

  async insert(reservation: Reservation): Promise<void> {
    this.storage[reservation.id] = reservation;
  }

  async remove(reservation: Reservation): Promise<boolean> {
    if (!this.storage[reservation.id]) {
      return false;
    }
    
    delete this.storage[reservation.id];
    return true;
  }
}