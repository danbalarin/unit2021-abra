// https://rezervace.s3.eu-central-1.amazonaws.com/parkingLog5.json

import axios from 'axios';
import { Config } from '../utils/config';
import Auth from '../utils/auth';

export interface SensorHistory {
  place: number
  modified: number
  value: boolean
}

interface SensorsActual {
  [key: number]: boolean
}

export default class SensorsApi {

  private config: Config;

  constructor(options: {
    config: Config,
  }) {
    Object.assign(this, options);
  }

  async listHistory(): Promise<SensorHistory[]> {
    const req = await axios.get(this.config.sensors.apiUrlHistory);

    const sensorData = req.data;
    return sensorData as SensorHistory[];
  }
  
  async listActual(): Promise<SensorsActual> {
    const req = await axios.get(this.config.sensors.apiUrlActual);

    const sensorData = req.data;
    return sensorData as SensorsActual;
  }

}