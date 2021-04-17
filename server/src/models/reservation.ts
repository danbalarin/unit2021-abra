import ParkingPlace from './parkingPlace';
import User from './user';

export default class Reservation {
  
  private _id?: number;
  private _parkingPlace: ParkingPlace;
  readonly user: User;
  readonly from: Date;
  readonly to: Date;

  public get id(): number { return this._id; }
  public get parkingPlace(): ParkingPlace { return this._parkingPlace; }

  constructor(options: {
    id?: number,
    user: User,
    from: Date,
    to: Date,
    parkingPlace: ParkingPlace,
  }) {
    this._id = options.id;
    this.user = options.user;
    this.from = options.from;
    this.to = options.to;
    this._parkingPlace = options.parkingPlace;
    this._parkingPlace.addReservation(this);
  }

  setId(id: number) {
    this._id = id;
  }

  conflictsWithTimeRange(from: Date, to: Date): boolean {
    const reserve = 20; // in ms

    const f1 = new Date(this.from.getTime() - reserve);
    const f2 = new Date(from.getTime() - reserve);
    const t1 = new Date(this.to.getTime() + reserve);
    const t2 = new Date(to.getTime() + reserve);

    return f1 < t2 && t1 > f2;
  }

  moveToPlace(parkingPlace: ParkingPlace): void {
    this._parkingPlace.removeReservation(this);
    parkingPlace.addReservation(this);
    this._parkingPlace = parkingPlace;
  }

  toJSON(): Object {
    return {
      id: this.id,
      parkingPlaceId: this.parkingPlace.code,
      userId: this.user.id,
      from: this.from,
      to: this.to,
    };
  }

}