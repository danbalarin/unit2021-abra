import ReservationController from '../controllers/reservation';

export default interface IControllers {
  getReservationsController(): ReservationController;
}