import ReservationsRepository from '../repositories/inmemory/reservations';
import ReservationsAPI, { ReservationPayload } from '../api/reservations';
import Reservation from '../models/reservation';
import User from '../models/user';
import ParkingSpot from '../models/parkingSpot';
import UsersRepository from '../repositories/inmemory/users';
import ParkingSpotsRepository from '../repositories/inmemory/parkingSpots';

export default class ReservationBusiness {

  private api: ReservationsAPI;
  private repoReservations: ReservationsRepository;
  private repoUsers: UsersRepository;
  private repoParkingSpots: ParkingSpotsRepository;

  constructor(options: {
    api: ReservationsAPI,
    repoReservations: ReservationsRepository,
    repoUsers: UsersRepository,
    repoParkingSpots: ParkingSpotsRepository,
  }) {
    Object.assign(options);
  }

  async list(): Promise<Reservation[]> {
    return this.api.list();
  }
  
  async create(data: ReservationPayload): Promise<Reservation> {
    const user = await this.repoUsers.findByUsername(data.username);

    const id = await this.api.create(data);

    const parkingSpot = await this.repoParkingSpots.findById(data.parkingSpotId);

    const reservation = new Reservation({
      id: id,
      user: user,
      parkingSpot: parkingSpot,
      from: data.from,
      to: data.to,
    });

    await this.repoReservations.insert(reservation);

    return reservation;
  }
}