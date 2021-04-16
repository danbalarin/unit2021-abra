import { Express } from 'express';
import ReservationAPI from './api/reservation';
import ReservationBusiness from './business/reservation';
import ReservationController from './controllers/reservation';
import { createServer } from './http/server';
import ReservationRepository from './repositories/inmemory/reservation';
import Auth from './utils/auth';
import { Config, loadEnvConfig } from './utils/config';

export default class ParkingService {
  private auth: Auth;
  private config: Config;
  private http: Express;

  private reservationsRepo: ReservationRepository;
  private reservationsApi: ReservationAPI;
  private reservationsBusiness: ReservationBusiness;
  private reservationsController: ReservationController;
  
  constructor() {
    
  }

  init() {
    this.config = loadEnvConfig();
    this.auth = new Auth({ config: this.config });

    this.initReservations();

    this.http = createServer({
      port: this.config.http.port,
      controllers: this,
    });
  }

  private initReservations() {
    this.reservationsRepo = new ReservationRepository();
    this.reservationsApi = new ReservationAPI({ config: this.config, auth: this.auth });
    this.reservationsBusiness = new ReservationBusiness({ api: this.reservationsApi, repo: this.reservationsRepo });
    this.reservationsController = new ReservationController({ bc: this.reservationsBusiness });
  }

  public getReservationsController(): ReservationController {
    return this.reservationsController;
  }
}