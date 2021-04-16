import { Express } from 'express';
import IControllers from './interface';

export function applyRoutes(app: Express, controllers: IControllers) {
  const reservations = controllers.getReservationsController();
  const users = controllers.getUsersController();

  app.get("/reservations", users.validate, reservations.list);
  app.put("/reservations", users.validate, reservations.create);
  app.delete("/reservations", users.validate, reservations.delete);
}