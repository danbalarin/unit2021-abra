import axios from 'axios';
import { Config } from '../utils/config';
import Auth from '../utils/auth';
import User from '../models/user';
import ParkingPlace from '../models/parkingPlace';

export interface ReservationPayload {
  from: Date,
  to: Date,
  parkingPlace: ParkingPlace,
  user: User,
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

  async list(): Promise<ReservationResponse[]> {
    const customColumns = "id,lastUpdate,zahajeni,dokonceni,predmet,zodpPrac,zakazka,volno,typAkt";
    const req = await axios.get(`${this.config.flexibee.companyUrl}/udalost.json?limit=0&detail=custom:${customColumns}`, {
      headers: this.auth.getBasicAuthHeader()
    });

    const events = req.data.winstrom.udalost;
    return events as ReservationResponse[];
  }
  
  async create({ user, from, to, parkingPlace }: ReservationPayload): Promise<number> {
    const eventData = {
      "typAkt": "code:UDÁLOST",
      "zodpPrac": `code:${user.username}`,
      "zahajeni": from.toISOString(),
      "dokonceni": to.toISOString(),
      "predmet": `${user.name || user.username} ${formatDateToTime(from)} - ${formatDateToTime(to)}`,
      "zakazka": `code:${parkingPlace.code}`,
      "volno": false
    };

    const res = await axios.put(`${this.config.flexibee.companyUrl}/udalost.json`, {
      "winstrom": {
        "udalost": [
          eventData
        ]
      }
    }, {
      headers: Object.assign({
        'Accept': 'application/json'
      }, this.auth.getBasicAuthHeader())
    }).catch(err => {
      console.error(eventData);
      throw new Error(err.response.statusText);
    });

    if (res.status >= 400) {
      throw new Error(res.statusText);
    };

    const errors = res.data.winstrom.results[0].errors;
    if (errors) {
      throw new Error(errors[0].message);
    }

    return Number.parseInt(res.data.winstrom.results[0].id);
  }

  async remove(id: number): Promise<void> {
    const res = await axios.delete(`${this.config.flexibee.companyUrl}/udalost/${id}.json`, {
      headers: Object.assign({
        'Accept': 'application/json'
      }, this.auth.getBasicAuthHeader())
    }).catch(err => {
      throw new Error(err.response.statusText);
    });
  }

}

function formatDateToTime(date: Date): string {
  const hours = date.getHours();
  const minutes = ("00" + date.getMinutes().toString()).substr(-2);
  return `${hours}:${minutes}`;
}