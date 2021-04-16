import { Response, Request } from 'express';
import ReservationsBusiness, * as bc from '../business/reservations';

export default class ReservationsController {
  
  private bc: ReservationsBusiness;

  constructor(options: {
    bc: ReservationsBusiness
  }) {
    Object.assign(this, options);
  }

  async list(req: Request, res: Response) {
    const data = await this.bc.list();

    res.json({
      data
    });
  }

  create(req: Request, res: Response) {
    const {

    } = req.body;

    res.json({
      "state": "Ok"
    });
  }

  delete(req: Request, res: Response) {

    res.json({
      "state": "Ok"
    });
  }
}