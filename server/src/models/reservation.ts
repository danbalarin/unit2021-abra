import ParkingPlace from './parkingPlace';
import User from './user';

export default class Reservation {
  
  readonly id: number;
  readonly parkingPlace: ParkingPlace;
  readonly user: User;
  readonly from: Date;
  readonly to: Date;

  constructor(options: {
    id: number,
    parkingPlace: ParkingPlace,
    user: User,
    from: Date,
    to: Date,
  }) {
    Object.assign(this, options);
  }

  public conflictsWithTimeRange(from: Date, to: Date): boolean {
    return (
      (this.from > from && this.from < to) ||
      (from > this.from && from < this.to)
    );
  }

}