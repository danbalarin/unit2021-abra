// https://rezervace.s3.eu-central-1.amazonaws.com/parkingLog5.json

import axios from 'axios';
import { Config } from '../utils/config';
import Auth from '../utils/auth';

export interface SensorHistory {
  place: number
  modified: number
  value: boolean
}

export default class ParkingPlacesApi {

  private config: Config;

  constructor(options: {
    config: Config,
  }) {
    Object.assign(this, options);
  }

  async list(): Promise<SensorHistory[]> {
    const req = await axios.get(this.config.sensors.apiUrl);

    const sensorData = req.data;
    return sensorData as SensorHistory[];
  }

}