import { Express } from 'express';
import IControllers from './interface';

export function applyRoutes(app: Express, controllers: IControllers) {
  const reservations = controllers.getReservationsController();

  app.get("/reservations", reservations.list);
  app.put("/reservations", reservations.create);
}