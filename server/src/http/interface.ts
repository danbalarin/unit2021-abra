import UsersController from '../controllers/users';
import ReservationsController from '../controllers/reservations';

export default interface IControllers {
  getReservationsController(): ReservationsController;
  getUsersController(): UsersController;
}