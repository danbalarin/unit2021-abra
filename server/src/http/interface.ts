import UsersController from '../controllers/users';
import ReservationsController from '../controllers/reservations';

export default interface ControllersInterface {
  getReservationsController(): ReservationsController;
  getUsersController(): UsersController;
}