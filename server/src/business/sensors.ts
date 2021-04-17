import UsersRepository from '../repositories/inmemory/users';
import ParkingPlacesRepository from '../repositories/inmemory/parkingPlaces';
import SensorsApi, { SensorHistory } from '../api/sensor';
import { Config } from '../utils/config';
import ReservationsBusinessInterface from './reservations';
import SensorsBusinessInterface from './sensorsInterface';
import UsersBusinessInterface from './usersInterface';
import Notifier, { NotifyMessage } from '../utils/notifier';

export default class SensorsBusiness implements SensorsBusinessInterface {

  private config: Config;
  private api: SensorsApi;
  private notifier: Notifier;
  private bcReservations: ReservationsBusinessInterface;
  private bcUsers: UsersBusinessInterface;

  private lastProcessed: number;
  private timeout?: NodeJS.Timeout;

  constructor(options: {
    config: Config,
    api: SensorsApi,
    notifier: Notifier,
    bcReservations: ReservationsBusinessInterface,
    bcUsers: UsersBusinessInterface
  }) {
    Object.assign(this, options);
    this.timeout = null;
    this.lastProcessed = 0;
  }

  private async processChange(change: SensorHistory) {
    const reservation = await this.bcReservations.getByPlaceIdAndDateTime(change.place, new Date(change.modified));
    const reservationStart = await this.bcReservations.getByPlaceIdAndDateTime(change.place, new Date(change.modified));

    if (change.value === false) {
      // User departed
      if (reservation) {
        // User departed from his parking spot
        this.bcReservations.endNow(reservation);
      }
    } else {
      // User arrived
      if (!reservation) {
        // Someone captured parking spot without reservation
        this.sendNotificationToReception(NotifyMessage.USER_ON_UNRESERVED_PLACE);
      }
    }
  }

  private async loop() {
    let history = await this.api.listHistory();
    history = history.filter(item => item.modified > this.lastProcessed);
    
    for (const change of history) {
      this.processChange(change);
    }

    this.lastProcessed = Date.now();
  }

  async start() {
    if (this.timeout !== null) return; 

    this.loop();

    this.timeout = setInterval(() => {
      this.loop();
    }, this.config.sensors.interval);
  }

  async stop() {
    if (this.timeout === null) return; 

    clearInterval(this.timeout);
    this.timeout = null;
  }

  private async sendNotificationToReception(notifyMessage: NotifyMessage): Promise<void> {
    const receptionists = await this.bcUsers.getReceptionists();
    receptionists.forEach(receptionist => {
      this.notifier.sendEmail(receptionist.email, notifyMessage);
    });
  }

  async isParkingPlaceOccupied(code: number): Promise<Boolean> {
    const list = await this.api.listActual();

    if (!list[code]) {
      throw new Error(`Parking place ${code} doesn't exist!`);
    }

    return list[code];
  }
}