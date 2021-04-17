import { Express } from 'express';
import ParkingPlacesApi from './api/parkingPlaces';
import ReservationsApi from './api/reservations';
import SensorsApi from './api/sensor';
import UsersApi from './api/users';
import ParkingPlacesBusiness from './business/parkingPlaces';
import ReservationsBusiness from './business/reservations';
import UsersBusiness from './business/users';
import ReservationsController from './controllers/reservations';
import UsersController from './controllers/users';
import { createServer } from './http/server';
import ParkingPlacesRepository from './repositories/inmemory/parkingPlaces'
import ReservationsRepository from './repositories/inmemory/reservations';
import UsersRepository from './repositories/inmemory/users';
import Auth from './utils/auth';
import { Config, loadEnvConfig } from './utils/config';

export default class ParkingService {
  private auth: Auth;
  private config: Config;
  private http: Express;

  private reservationsRepo: ReservationsRepository;
  private usersRepo: UsersRepository;
  private parkingPlacesRepo: ParkingPlacesRepository;

  private sensorsApi: SensorsApi;
  private reservationsApi: ReservationsApi;
  private usersApi: UsersApi;
  private parkingPlacesApi: ParkingPlacesApi;

  private reservationsBusiness: ReservationsBusiness;
  private usersBusiness: UsersBusiness;
  private parkingPlacesBusiness: ParkingPlacesBusiness;

  private reservationsController: ReservationsController;
  private usersController: UsersController;
  
  constructor() {
    
  }

  async init() {
    this.config = loadEnvConfig();
    this.auth = new Auth({ config: this.config });

    await this.setupLogic();

    this.http = createServer({
      port: this.config.http.port,
      config: this.config,
      controllers: this,
    });
  }

  async setupLogic() {
    this.reservationsRepo = new ReservationsRepository();
    this.usersRepo = new UsersRepository();
    this.parkingPlacesRepo = new ParkingPlacesRepository();

    this.sensorsApi = new SensorsApi({ config: this.config });
    this.reservationsApi = new ReservationsApi({ config: this.config, auth: this.auth });
    this.usersApi = new UsersApi({ config: this.config, auth: this.auth });
    this.parkingPlacesApi = new ParkingPlacesApi({ config: this.config, auth: this.auth });

    this.usersBusiness = new UsersBusiness({
      api: this.usersApi,
      repoUsers: this.usersRepo,
    })

    await this.usersBusiness.fetch();

    this.parkingPlacesBusiness = new ParkingPlacesBusiness({
      api: this.parkingPlacesApi,
      repoUsers: this.usersRepo,
      repoParkingPlaces: this.parkingPlacesRepo,
    })

    await this.parkingPlacesBusiness.fetch();

    this.reservationsBusiness = new ReservationsBusiness({
      api: this.reservationsApi,
      repoParkingPlaces: this.parkingPlacesRepo,
      repoUsers: this.usersRepo,
      repoReservations: this.reservationsRepo,
    });

    await this.reservationsBusiness.fetch();

    this.usersController = new UsersController({ bc: this.usersBusiness });
    this.reservationsController = new ReservationsController({ bc: this.reservationsBusiness });
  }

  public getReservationsController(): ReservationsController {
    return this.reservationsController;
  }

  public getUsersController(): UsersController {
    return this.usersController;
  }
}