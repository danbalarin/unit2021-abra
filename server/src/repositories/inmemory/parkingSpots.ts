import ParkingSpot from "../../models/parkingSpot";

export default class ParkingSpotsRepository {
  private storage: {[id: number]: ParkingSpot};
  
  constructor() {
    this.storage = {};
  }

  async findById(id: number): Promise<ParkingSpot | null> {
    return this.storage[id];
  }

  async findAll(): Promise<ParkingSpot[]> {
    return Object.values(this.storage);
  }

  async insert(parkingSpot: ParkingSpot): Promise<void> {
    this.storage[parkingSpot.id] = parkingSpot;
  }
}