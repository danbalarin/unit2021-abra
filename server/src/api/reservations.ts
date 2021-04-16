import axios from 'axios';
import { Config } from '../utils/config';
import Reservation from '../models/reservation';
import Auth from '../utils/auth';

export interface ReservationPayload {
  id?: number,
  from: Date,
  to: Date,
  parkingSpotId: number,
  username: string,
}

export default class ReservationAPI {

  private config: Config;
  private auth: Auth;

  constructor(options: {
    config: Config,
    auth: Auth,
  }) {
    Object.assign(this, options);
  }
  
  async create(reservation: ReservationPayload): Promise<number> {
    const res = await axios.put(`${this.config.flexibee.companyUrl}/udalost.json`, {
      "winstrom": {
        "udalost": [
          {
            "typAkt": "code:UDÁLOST",
            "zodpPrac": `code:${reservation.username}`,
            "zahajeni": reservation.from.toISOString(),
            "dokonceni": reservation.to.toISOString(),
            "predmet": `${reservation.username} ${formatDateToTime(reservation.from)} - ${formatDateToTime(reservation.to)}`,
            "zakazka": `code:${reservation.parkingSpotId}`,
            "volno": false
          }
        ]
      }
    }, {
      headers: this.auth.getBasicAuthHeader()
    });

    if (res.status >= 400) {
      throw new Error(res.statusText);
    };

    let err: string;
    if (err = res.data.winstrom.results[0]?.errors[0].message) {
      throw new Error(err);
    }

    return Number.parseInt(res.data.winstrom.results[0].id);
  }

  async list(): Promise<ReservationPayload[]> {
    const req = await axios.get(`${this.config.flexibee.companyUrl}/udalost.json?limit=0`, {
      headers: this.auth.getBasicAuthHeader()
    });

    const res = JSON.parse(req.data);
    const events = res.winstrom.udalost;

    return events as ReservationPayload[];
  }

}

function formatDateToTime(date: Date): string {
  const hours = date.getHours();
  const minutes = "00" + date.getMinutes().toString().substr(-2);
  return `${hours}:${minutes}`;
}