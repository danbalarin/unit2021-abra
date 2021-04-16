import ParkingService from './service';

async function main() {
  const srv = new ParkingService();
  await srv.init();
}

main();