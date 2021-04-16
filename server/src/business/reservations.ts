import ReservationsRepository from '../repositories/inmemory/reservations';
import ReservationsAPI, { ReservationPayload } from '../api/reservations';
import Reservation from '../models/reservation';
import User from '../models/user';
import ParkingPlace from '../models/parkingPlace';
import UsersRepository from '../repositories/inmemory/users';
import ParkingPlacesRepository from '../repositories/inmemory/parkingPlaces';

export default class ReservationsBusiness {

  private api: ReservationsAPI;
  private repoReservations: ReservationsRepository;
  private repoUsers: UsersRepository;
  private repoParkingPlaces: ParkingPlacesRepository;

  private isFetched: boolean;

  constructor(options: {
    api: ReservationsAPI,
    repoReservations: ReservationsRepository,
    repoUsers: UsersRepository,
    repoParkingPlaces: ParkingPlacesRepository,
  }) {
    Object.assign(this, options);
    this.isFetched = false;
  }

  async fetch(): Promise<Reservation[]> {
    if (this.isFetched) return;
    
    const reservationsRaw = await this.api.list();
    const reservations = await Promise.all(reservationsRaw.map(async reservationRaw => {
      const username = reservationRaw.zodpPrac.replace(/^code:/, "");
      const parkingPlaceId = Number.parseInt(reservationRaw.zakazka.replace(/^code:/, ""));
      
      const user = await this.repoUsers.findByUsername(username);
      const parkingPlace = await this.repoParkingPlaces.findById(parkingPlaceId);

      return new Reservation({
        id: reservationRaw.id,
        parkingPlace: parkingPlace,
        user: user,
        from: new Date(reservationRaw.zahajeni),
        to: new Date(reservationRaw.dokonceni),
      });
    }));

    console.log(reservations);

    reservations.forEach(reservation => this.repoReservations.insert(reservation));
    
    this.api.list();
    this.isFetched = true;
  }

  async list(): Promise<Reservation[]> {
    return await this.repoReservations.findAll();
  }
  
  async create(data: ReservationPayload): Promise<Reservation> {
    const user = await this.repoUsers.findByUsername(data.username);

    const id = await this.api.create(data);

    const parkingPlace = await this.repoParkingPlaces.findById(data.parkingPlaceId);

    const reservation = new Reservation({
      id: id,
      user: user,
      parkingPlace: parkingPlace,
      from: data.from,
      to: data.to,
    });

    await this.repoReservations.insert(reservation);

    return reservation;
  }
}