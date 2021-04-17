import { Express } from 'express';
import ParkingPlacesApi from './api/parkingPlaces';
import ReservationsApi from './api/reservations';
import SensorsApi from './api/sensor';
import UsersApi from './api/users';
import ParkingPlacesBusiness from './business/parkingPlaces';
import ReservationsBusiness from './business/reservations';
import SensorsBusiness from './business/sensors';
import UsersBusiness from './business/users';
import ParkingPlacesController from './controllers/parkingPlaces';
import ReservationsController from './controllers/reservations';
import UsersController from './controllers/users';
import { createServer } from './http/server';
import ParkingPlacesRepository from './repositories/inmemory/parkingPlaces'
import ReservationsRepository from './repositories/inmemory/reservations';
import UsersRepository from './repositories/inmemory/users';
import Auth from './utils/auth';
import { Config, loadEnvConfig } from './utils/config';
import Notifier from './utils/notifier';

export default class ParkingService {
  private auth: Auth;
  private config: Config;
  private notifier: Notifier;
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
  private sensorsBusiness: SensorsBusiness;

  private reservationsController: ReservationsController;
  private usersController: UsersController;
  private parkingPlacesController: ParkingPlacesController;
  
  constructor() {
    
  }

  async init() {
    this.config = loadEnvConfig();
    this.auth = new Auth({ config: this.config });
    this.notifier = new Notifier({ config: this.config });

    await this.initRepositories();
    await this.initApis();
    await this.initBusinesses();
    await this.initControllers();

    this.http = createServer({
      port: this.config.http.port,
      config: this.config,
      controllers: this,
    });
  }

  async initRepositories() {
    this.reservationsRepo = new ReservationsRepository();
    this.usersRepo = new UsersRepository();
    this.parkingPlacesRepo = new ParkingPlacesRepository();
  }

  async initApis() {
    this.sensorsApi = new SensorsApi({ config: this.config });
    this.reservationsApi = new ReservationsApi({ config: this.config, auth: this.auth });
    this.usersApi = new UsersApi({ config: this.config, auth: this.auth });
    this.parkingPlacesApi = new ParkingPlacesApi({ config: this.config, auth: this.auth });
  }

  async initBusinesses() {
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

    this.sensorsBusiness = new SensorsBusiness({ 
      config: this.config,
      notifier: this.notifier,
      api: this.sensorsApi,
      bcReservations: this.reservationsBusiness,
      bcUsers: this.usersBusiness,
    });

    this.sensorsBusiness.start();
  }

  async initControllers() {
    this.usersController = new UsersController({ bc: this.usersBusiness });
    this.reservationsController = new ReservationsController({ bc: this.reservationsBusiness });
    this.parkingPlacesController = new ParkingPlacesController({ bc: this.parkingPlacesBusiness });
  }


  public getReservationsController(): ReservationsController {
    return this.reservationsController;
  }

  public getUsersController(): UsersController {
    return this.usersController;
  }

  public getParkingPlacesController(): ParkingPlacesController {
    return this.parkingPlacesController;
  }
}