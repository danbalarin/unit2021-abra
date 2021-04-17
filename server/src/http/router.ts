import { Express } from 'express';
import IControllers from './interface';

export function applyRoutes(app: Express, controllers: IControllers) {
  const reservations = controllers.getReservationsController();
  const users = controllers.getUsersController();
  const validate = users.validate.bind(users);

  app.get("/reservations", validate, reservations.list.bind(reservations));
  app.put("/reservations", validate, reservations.create.bind(reservations));
  app.delete("/reservations/:reservationId", validate, reservations.remove.bind(reservations));
}