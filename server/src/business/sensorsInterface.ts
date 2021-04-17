export default interface SensorsBusinessInterface {
  start(): Promise<void>;
  stop(): Promise<void>;
  isParkingPlaceOccupied(code: number): Promise<Boolean>;
}