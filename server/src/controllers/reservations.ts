import { Response, Request } from 'express';
import ReservationsBusinessInterface, { ERR_NO_PLACE_AVAILABLE } from '../business/reservationsInterface';

export default class ReservationsController {
  
  private bc: ReservationsBusinessInterface;

  constructor(options: {
    bc: ReservationsBusinessInterface
  }) {
    Object.assign(this, options);
  }

  async list(req: Request, res: Response) {
    const reservations = await this.bc.list();
    const data = reservations.map(reservation => reservation.toJSON());

    res.json({
      success: true,
      data: data,
    });
  }

  async create(req: Request, res: Response) {
    console.log(req.body);
    const to: string = String(req.body.to);
    const from: string = String(req.body.from);
    const userId: number | null = req.body.userId ? Number.parseInt(req.body.userId) : null

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