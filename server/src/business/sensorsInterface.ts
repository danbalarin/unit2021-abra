export default interface SensorsBusinessInterface {
  start(): Promise<void>;
  stop(): Promise<void>;
  isParkingPlaceOccupied(code: number, from?: Date, to?: Date): Promise<Boolean>;
}