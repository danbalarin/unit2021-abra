import { Express } from 'express';
import ControllersInterface from './interface';

export function applyRoutes(app: Express, controllers: ControllersInterface) {
  const reservations = controllers.getReservationsController();
  const users = controllers.getUsersController();
  const parkingPlaces = controllers.getParkingPlacesController();

  const validate = users.validate.bind(users);

  app.get("/users", validate, users.list.bind(users));

  app.get("/reservations", validate, reservations.list.bind(reservations));
  app.put("/reservations", validate, reservations.create.bind(reservations));
  app.post("/reservations/:reservationId", validate, reservations.edit.bind(reservations));
  app.delete("/reservations/:reservationId", validate, reservations.remove.bind(reservations));
}