import ParkingPlace from "../../models/parkingPlace";

export default class ParkingPlacesRepository {
  private storage: {[id: number]: ParkingPlace};
  
  constructor() {
    this.storage = {};
  }

  async findById(id: number): Promise<ParkingPlace | null> {
    return this.storage[id];
  }

  async findAll(): Promise<ParkingPlace[]> {
    return Object.values(this.storage);
  }

  async insert(parkingPlace: ParkingPlace): Promise<void> {
    this.storage[parkingPlace.id] = parkingPlace;
  }
}