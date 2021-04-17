import UsersController from '../controllers/users';
import ReservationsController from '../controllers/reservations';
import ParkingPlacesController from '../controllers/parkingPlaces';

export default interface ControllersInterface {
  getReservationsController(): ReservationsController;
  getUsersController(): UsersController;
  getParkingPlacesController(): ParkingPlacesController;
}