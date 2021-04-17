import ReservationsRepository from '../repositories/inmemory/reservations';
import UsersApi, { UserResponse } from '../api/users';
import Reservation from '../models/reservation';
import User, {UserRole} from '../models/user';
import ParkingPlace from '../models/parkingPlace';
import UsersRepository from '../repositories/inmemory/users';
import ParkingPlacesRepository from '../repositories/inmemory/parkingPlaces';

export default interface UsersBusinessInterface {
  fetch(): Promise<User[]>;
  list(): Promise<User[]>;
  getUserByAuthToken(token: string): Promise<User>;
  getReceptionists(): Promise<User[]>;
}