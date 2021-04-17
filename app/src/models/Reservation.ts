export interface Reservation {
  id?: number;
  from: string;
  to: string;
  parkingPlaceId: number;
  userId: number;
}

export const RESERVATION: Reservation[] = [
  {
    userId: 56,
    from: new Date("2021-04-17T08:00:00+00:00"),
    to: new Date("2021-04-17T18:00:00+00:00"),
    parkingPlaceId: 105,
  },
  {
    userId: 56,
    from: new Date("2021-04-18T08:00:00+00:00"),
    to: new Date("2021-04-18T18:00:00+00:00"),
    parkingPlaceId: 105,
  },
  {
    userId: 41,
    from: new Date("2021-04-19T08:00:00+00:00"),
    to: new Date("2021-04-19T18:00:00+00:00"),
    parkingPlaceId: 104,
  },
  {
    userId: 41,
    from: new Date("2021-04-19T08:00:00+00:00"),
    to: new Date("2021-04-19T18:00:00+00:00"),
    parkingPlaceId: 102,
  },
  {
    userId: 41,
    from: new Date("2021-04-18T08:00:00+00:00"),
    to: new Date("2021-04-18T18:00:00+00:00"),
    parkingPlaceId: 106,
  },
];
