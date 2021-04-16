import ReservationsRepository from '../repositories/inmemory/reservations';
import UsersApi, { UserResponse } from '../api/users';
import Reservation from '../models/reservation';
import User, {UserRole} from '../models/user';
import ParkingPlace from '../models/parkingPlace';
import UsersRepository from '../repositories/inmemory/users';
import ParkingPlacesRepository from '../repositories/inmemory/parkingPlaces';

export default class UsersBusiness {

  private api: UsersApi;
  private repoUsers: UsersRepository;

  private isFetched: boolean;

  constructor(options: {
    api: UsersApi,
    repoUsers: UsersRepository,
  }) {
    Object.assign(this, options);
    this.isFetched = false;
  }

  async fetch(): Promise<User[]> {
    if (this.isFetched) return;

    const usersRaw = await this.api.list();
    const users: User[] = usersRaw.map(userRaw => {
      return new User({
        id: userRaw.id,
        username: userRaw.kod,
        email: userRaw.email,
        name: `${userRaw.jmeno} ${userRaw.prijmeni}`,
        role: userRaw.role as UserRole
      });
    })

    users.forEach(user => this.repoUsers.insert(user));
    
    this.isFetched = true;
  }

  async list(): Promise<User[]> {
    return await this.repoUsers.findAll();
  }
}