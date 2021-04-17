import UsersRepository from '../repositories/inmemory/users';
import ParkingPlacesRepository from '../repositories/inmemory/parkingPlaces';
import SensorsApi from '../api/sensor';

export default class SensorsBusiness {

  private api: SensorsApi;
  private repoUsers: UsersRepository;
  private repoParkingPlaces: ParkingPlacesRepository;

  private lastProcessed: boolean;

  constructor(options: {
    api: SensorsApi,
    repoUsers: UsersRepository,
    repoParkingPlaces: ParkingPlacesRepository,
  }) {
    Object.assign(this, options);
  }

  async fetch(): Promise<void> {
    this.api.list();
  }
}