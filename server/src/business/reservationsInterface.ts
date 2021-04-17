import ReservationsRepository from '../repositories/inmemory/reservations';
import ReservationsAPI, { ReservationPayload } from '../api/reservations';
import Reservation from '../models/reservation';
import User from '../models/user';
import ParkingPlace from '../models/parkingPlace';
import UsersRepository from '../repositories/inmemory/users';
import ParkingPlacesRepository from '../repositories/inmemory/parkingPlaces';

export const ERR_NO_PLACE_AVAILABLE = "No places are available for this time range."; 

export default interface ReservationsBusinessInterface {
  fetch(): Promise<Reservation[]>;
  getById(id: number): Promise<Reservation | null>;
  getByPlaceIdAndDateTime(placeId: number, date: Date): Promise<Reservation | null>;
  list(): Promise<Reservation[]>;
  create({ from, to, userId }: {
    from: Date,
    to: Date,
    userId?: number,
  }): Promise<Reservation>;
  endNow(reservation: Reservation): Promise<void>;
  remove(reservation: Reservation): Promise<void>;
  getAvailableParkingPlace(from: Date, to: Date): Promise<ParkingPlace | null>;
}