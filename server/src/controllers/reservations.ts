import { Response, Request } from 'express';
import Reservation from '../models/reservation';
import ReservationsBusinessInterface, { ERR_NO_PLACE_AVAILABLE } from '../business/reservationsInterface';

export default class ReservationsController {
  
  private bc: ReservationsBusinessInterface;

  constructor(options: {
    bc: ReservationsBusinessInterface
  }) {
    Object.assign(this, options);
  }

  async list(req: Request, res: Response) {
    const user = res.locals.user;

    let reservations: Reservation[];
    if (user?.isAdmin()) {
      reservations = await this.bc.listAll();
    } else {
      reservations = await this.bc.listUsers(user);
    }

    const data = reservations.map(reservation => reservation.toJSON());

    res.json({
      success: true,
      data: data,
    });
  }

  async create(req: Request, res: Response) {
    const to: string = String(req.body.to);
    const from: string = String(req.body.from);
    const userId: number | null = req.body.userId ? Number.parseInt(req.body.userId) : null

    console.log("Creating:", {to, from, userId});

    if (userId != null) {
      if (!res.locals.user.isAdmin()) {
        return res.status(403).json({
          success: false,
          error: "Not authorized to create reservations for others."
        });
      }
    }

    try {
      await this.bc.create({
        to: new Date(to),
        from: new Date(from),
        userId: userId ?? res.locals.user.id
      });

      return res.json({
        success: true
      });
    } catch (e) {
      if (e === ERR_NO_PLACE_AVAILABLE) {
        return res.status(400).json({
          success: false,
          error: e
        });
      } else {
        console.error(e.isAxiosError ? e.response : e);
        return res.status(500).json({
          success: false,
          error: "Unexpected error happend while creating new reservation."
        });
      }
    }
  }

  async edit(req: Request, res: Response) {
    console.log(req.body);
    const reservationId: number = Number.parseInt(req.params.reservationId);
    const reservation = await this.bc.getById(reservationId);

    const to: string | null = String(req.body.to) || null;
    const from: string | null = String(req.body.from) || null;
    const placeId: number | null = req.body.placeId ? Number.parseInt(req.body.placeId) : null;

    if (reservation.user.id !== res.locals.user.id) {
      if (!res.locals.user.isAdmin()) {
        return res.status(403).json({
          success: false,
          error: "Not authorized to edit reservations for others."
        });
      }
    }

    try {
      await this.bc.edit(reservation, {
        to: new Date(to),
        from: new Date(from),
        placeId: placeId,
      });

      return res.json({
        success: true
      });
    } catch (e) {
      if (e === ERR_NO_PLACE_AVAILABLE) {
        return res.status(400).json({
          success: false,
          error: e
        });
      } else {
        console.error(e.isAxiosError ? e.response : e);
        return res.status(500).json({
          success: false,
          error: "Unexpected error happend while creating new reservation."
        });
      }
    }
  }

  async remove(req: Request, res: Response) {
    const reservationId: number = Number.parseInt(req.params.reservationId);
    const reservation = await this.bc.getById(reservationId);

    if (reservation === null) {
      return res.status(400).json({
        success: false,
        error: "Reservation with this id doesn't exit."
      });
    }

    if (reservation.user.id !== res.locals.user.id) {
      if (!res.locals.user.isAdmin()) {
        return res.status(403).json({
          success: false,
          error: "Not authorized to remove reservations of others."
        });
      }
    }

    try {
      this.bc.remove(reservation);

      return res.json({
        success: true
      });
    } catch (e) {
      if (e === ERR_NO_PLACE_AVAILABLE) {
        return res.status(400).json({
          success: false,
          error: e
        });
      } else {
        return res.status(500).json({
          success: false,
          error: "Unexpected error happend while creating new reservation."
        });
      }
    }
  }
}