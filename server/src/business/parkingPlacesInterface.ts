import ParkingPlace from '../models/parkingPlace';

export default interface ParkingPlacesBusinessInterface {
  fetch(): Promise<ParkingPlace[]>;
  list(): Promise<ParkingPlace[]>;
}