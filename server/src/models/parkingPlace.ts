export default class ParkingPlace {
  readonly id: number;
  readonly name: number;
  readonly ownerId?: number;

  constructor(options: {
    id: number,
    name: number,
    ownerId: number,
  }) {
    Object.assign(this, options);
  }
}