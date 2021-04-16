export interface Reservation {
  id?: number;
  from: Date;
  to: Date;
  parkingSpotId: number;
  username: string;
}

export const RESERVATION: Reservation[] = [
  {
    username: "team5.recepcni",
    from: new Date("2021-04-17T08:00:00+00:00"),
    to: new Date("2021-04-17T18:00:00+00:00"),
    parkingSpotId: 105,
  },
  {
    username: "team5.recepcni",
    from: new Date("2021-04-18T08:00:00+00:00"),
    to: new Date("2021-04-18T18:00:00+00:00"),
    parkingSpotId: 105,
  },
  {
    username: "team5.user1",
    from: new Date("2021-04-19T08:00:00+00:00"),
    to: new Date("2021-04-19T18:00:00+00:00"),
    parkingSpotId: 104,
  },
  {
    username: "team5.manager1",
    from: new Date("2021-04-19T08:00:00+00:00"),
    to: new Date("2021-04-19T18:00:00+00:00"),
    parkingSpotId: 102,
  },
  {
    username: "team5.manager6",
    from: new Date("2021-04-18T08:00:00+00:00"),
    to: new Date("2021-04-18T18:00:00+00:00"),
    parkingSpotId: 106,
  },
];
