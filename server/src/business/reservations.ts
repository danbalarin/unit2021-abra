import ReservationsRepository from '../repositories/inmemory/reservations';
import ReservationsAPI, { ReservationPayload } from '../api/reservations';
import Reservation from '../models/reservation';
import User from '../models/user';
import ParkingPlace from '../models/parkingPlace';
import UsersRepository from '../repositories/inmemory/users';
import ParkingPlacesRepository from '../repositories/inmemory/parkingPlaces';

export const ERR_NO_PLACE_AVAILABLE = "No places are available for this time range."; 

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
    
    let reservationsRaw = await this.api.list();
    console.log(reservationsRaw);
    const reservations = await Promise.all(reservationsRaw.map(async reservationRaw => {
      const username = reservationRaw.zodpPrac.replace(/^code:/, "");
      const parkingPlaceCode = Number.parseInt(reservationRaw.zakazka.replace(/^code:/, ""));

      console.log(parkingPlaceCode);
      
      const user = await this.repoUsers.findByUsername(username);
      const parkingPlace = await this.repoParkingPlaces.findByCode(parkingPlaceCode);

      const reservation = new Reservation({
        id: reservationRaw.id,
        parkingPlace: parkingPlace,
        user: user,
        from: new Date(reservationRaw.zahajeni),
        to: new Date(reservationRaw.dokonceni),
      });

      parkingPlace.addReservation(reservation);

      return reservation;
    }))

    reservations
      .filter(reservation => reservation !== null)
      .forEach(reservation => this.repoReservations.insert(reservation));
    
    this.api.list();
    this.isFetched = true;
  }

  async getById(id: number): Promise<Reservation | null> {
    return await this.repoReservations.findById(id);
  }

  async list(): Promise<Reservation[]> {
    return await this.repoReservations.findAll();
  }
  
  async create({ from, to, userId }: {
    from: Date,
    to: Date,
    userId?: number,
  }): Promise<Reservation> {
    const user = await this.repoUsers.findById(userId);
    const parkingPlace = await this.getAvailableParkingPlace(from, to);

    if (parkingPlace === null) {
      throw new Error(ERR_NO_PLACE_AVAILABLE);
    }

    const reservation = new Reservation({
      id: null,
      user: user,
      parkingPlace: parkingPlace,
      from: from,
      to: to,
    });

    try {
      const id = await this.api.create({
        from: from,
        to: to,
        user: user,
        parkingPlace: parkingPlace,
      });

      reservation.setId(id);

      await this.repoReservations.insert(reservation);
    } catch (e) {
      this.remove(reservation);
      throw e;
    }

    return reservation;
  }

  async remove(reservation: Reservation): Promise<void> {
    reservation.parkingPlace.removeReservation(reservation);
    this.repoReservations.remove(reservation);
  }

  async getAvailableParkingPlace(from: Date, to: Date): Promise<ParkingPlace | null> {
    const parkingPlaces = await this.repoParkingPlaces.findAll();

    for (const parkingPlace of parkingPlaces) {
      const conflicts = parkingPlace.getConflicts(from, to);
      if (conflicts.length === 0) {
        return parkingPlace;
      }
    }

    return null;
  }
}