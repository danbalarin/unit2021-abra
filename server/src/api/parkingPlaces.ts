import axios from 'axios';
import { Config } from '../utils/config';
import Auth from '../utils/auth';

export interface ParkingPlaceResponse {
  id:	number
  kod: string
  nazev: string
  zodpPrac: string
}

export default class ParkingPlacesApi {

  private config: Config;
  private auth: Auth;

  constructor(options: {
    config: Config,
    auth: Auth,
  }) {
    Object.assign(this, options);
  }

  async list(): Promise<ParkingPlaceResponse[]> {
    const req = await axios.get(`${this.config.flexibee.companyUrl}/zakazka.json?limit=0&detail=custom:id,kod,nazev,zodpPrac`, {
      headers: this.auth.getBasicAuthHeader()
    });

    const parkingPlaces = req.data.winstrom.zakazka;
    return parkingPlaces as ParkingPlaceResponse[];
  }

}