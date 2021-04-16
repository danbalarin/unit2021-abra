import axios from 'axios';
import { Config } from '../utils/config';
import Auth from '../utils/auth';

export interface ReservationPayload {
  from: Date,
  to: Date,
  parkingPlaceId: number,
  username: string,
  userRealName?: string,
}

export interface ReservationResponse {
  id: number
  typAkt: string
  zodpPrac: string
  zahajeni: string
  dokonceni: string
  predmet: string
  zakazka: string
  volno: boolean
}

export default class ReservationApi {

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
            "predmet": `${reservation.userRealName || reservation.username} ${formatDateToTime(reservation.from)} - ${formatDateToTime(reservation.to)}`,
            "zakazka": `code:${reservation.parkingPlaceId}`,
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

  async list(): Promise<ReservationResponse[]> {
    const req = await axios.get(`${this.config.flexibee.companyUrl}/udalost.json?limit=0`, {
      headers: this.auth.getBasicAuthHeader()
    });

    const events = req.data.winstrom.udalost;
    return events as ReservationResponse[];
  }

}

function formatDateToTime(date: Date): string {
  const hours = date.getHours();
  const minutes = "00" + date.getMinutes().toString().substr(-2);
  return `${hours}:${minutes}`;
}