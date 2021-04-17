import ReservationsRepository from '../repositories/inmemory/reservations';
import ReservationsAPI, { ReservationPayload } from '../api/reservations';
import Reservation from '../models/reservation';
import User from '../models/user';
import ParkingPlace from '../models/parkingPlace';
import UsersRepository from '../repositories/inmemory/users';
import ParkingPlacesRepository from '../repositories/inmemory/parkingPlaces';
import ReservationsBusinessInterface, { ERR_NO_PLACE_AVAILABLE } from './reservationsInterface';

export default class ReservationsBusiness implements ReservationsBusinessInterface {

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
    const reservations = await Promise.all(reservationsRaw.map(async reservationRaw => {
      const username = reservationRaw.zodpPrac.replace(/^code:/, "");
      const parkingPlaceCode = Number.parseInt(reservationRaw.zakazka.replace(/^code:/, ""));
      
      const user = await this.repoUsers.findByUsername(username);
      const parkingPlace = await this.repoParkingPlaces.findByCode(parkingPlaceCode);

      const reservation = new Reservation({
        id: reservationRaw.id,
        parkingPlace: parkingPlace,
        user: user,
        from: new Date(reservationRaw.zahajeni),
        to: new Date(reservationRaw.dokonceni),
      });

      if (reservationRaw.volno) {
        parkingPlace.addRelease(reservation);
      } else {
        parkingPlace.addReservation(reservation);
      }

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

  async getByPlaceIdAndDateTime(placeId: number, date: Date): Promise<Reservation | null> {
    const place = await this.repoParkingPlaces.findByCode(placeId);
    return place.getReservations().find(reservation => reservation.from >= date && reservation.to <= date);
  }

  async listAll(): Promise<Reservation[]> {
    return await this.repoReservations.findAll();
  }
  
  async listUsers(user: User): Promise<Reservation[]> {
    return await this.repoReservations.findByUserId(user.id);
  }
  
  async create({ from, to, userId }: {
    from: Date,
    to: Date,
    userId?: number,
  }): Promise<Reservation> {
    const user = await this.repoUsers.findById(userId);
    const parkingPlace = await this.getAvailableParkingPlace(from, to);

    if (parkingPlace === null) {
      throw ERR_NO_PLACE_AVAILABLE;
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
        isOwner: user.id === parkingPlace.ownerId
      });

      reservation.setId(id);

      await this.repoReservations.insert(reservation);
    } catch (e) {
      this.remove(reservation);
      throw e;
    }

    return reservation;
  }
  
  async edit(reservation: Reservation, updates: {
    from?: Date,
    to?: Date,
    placeId?: number,
  }): Promise<Reservation> {
    const parkingPlace = await this.getAvailableParkingPlace(updates.from, updates.to, reservation);

    if (parkingPlace === null) {
      throw ERR_NO_PLACE_AVAILABLE;
    }

    try {
      await this.api.update(reservation.id, updates);

      await this.repoReservations.insert(reservation);
    } catch (e) {
      this.remove(reservation);
      throw e;
    }

    return reservation;
  }

  async endNow(reservation: Reservation) {
    const now = new Date();
    reservation.setTo(now);
    this.api.update(reservation.id, {
      to: now
    });
  }

  async remove(reservation: Reservation): Promise<void> {
    if (reservation.id) {
      this.api.remove(reservation.id);
    }

    reservation.parkingPlace.removeReservation(reservation);
    this.repoReservations.remove(reservation);
  }

  async getAvailableParkingPlace(from: Date, to: Date, originalReservation?: Reservation): Promise<ParkingPlace | null> {
    const parkingPlaces = await this.repoParkingPlaces.findAll();

    for (const parkingPlace of parkingPlaces) {
      const conflicts = parkingPlace.getConflicts(from, to, originalReservation?.id);
      if (conflicts !== false && conflicts.length === 0) {
        return parkingPlace;
      }
    }

    return null;
  }
}