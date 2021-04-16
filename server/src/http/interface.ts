import UsersController from '../controllers/user';
import ReservationsController from '../controllers/reservations';

export default interface IControllers {
  getReservationsController(): ReservationsController;
  getUsersController(): UsersController;
}