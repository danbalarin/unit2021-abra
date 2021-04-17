import ReservationsRepository from '../repositories/inmemory/reservations';
import ParkingPlacesApi, { ParkingPlaceResponse } from '../api/parkingPlaces';
import User from '../models/user';
import ParkingPlace from '../models/parkingPlace';
import UsersRepository from '../repositories/inmemory/users';
import ParkingPlacesRepository from '../repositories/inmemory/parkingPlaces';
import ParkingPlacesBusinessInterface from './parkingPlacesInterface';

export default class ParkingPlacesBusiness implements ParkingPlacesBusinessInterface {

  private api: ParkingPlacesApi;
  private repoUsers: UsersRepository;
  private repoParkingPlaces: ParkingPlacesRepository;

  private isFetched: boolean;

  constructor(options: {
    api: ParkingPlacesApi,
    repoUsers: UsersRepository,
    repoParkingPlaces: ParkingPlacesRepository,
  }) {
    Object.assign(this, options);
    this.isFetched = false;
  }

  async fetch(): Promise<ParkingPlace[]> {
    if (this.isFetched) return;
    
    const parkingPlacesRaw = await this.api.list();
    const parkingPlaces = await Promise.all(parkingPlacesRaw.map(async parkingPlaceRaw => {
      const username = parkingPlaceRaw.zodpPrac.replace("code:", "");
      const user = await this.repoUsers.findByUsername(username);

      return new ParkingPlace({
        id: parkingPlaceRaw.id,
        code: Number.parseInt(parkingPlaceRaw.kod),
        ownerId: user?.id ?? null
      });
    }));

    parkingPlaces.forEach(parkingPlace => this.repoParkingPlaces.insert(parkingPlace));

    this.isFetched = true;
  }

  async list(): Promise<ParkingPlace[]> {
    return await this.repoParkingPlaces.findAll();
  }
}