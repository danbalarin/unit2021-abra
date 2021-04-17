import { Response, Request, NextFunction } from 'express';
import ParkingPlacesBusinessInterface from '../business/ParkingPlacesInterface';

export default class ParkingPlacesController {
  
  private bc: ParkingPlacesBusinessInterface;

  constructor(options: {
    bc: ParkingPlacesBusinessInterface
  }) {
    Object.assign(this, options);
  }

  async list(req: Request, res: Response) {
    try {
      const parkingPlaces = await this.bc.list();
      const data = parkingPlaces.map(parkingPlace => parkingPlace.toJSON());

      return res.json({
        success: true,
        data: data,
      });
    } catch (e) {
      console.error(e);
      return res.status(401).json({
        'error': `Your auth token is not valid. Please login again.`,
      });
    }
  }
}