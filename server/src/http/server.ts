import express from 'express';
import { Config } from '../utils/config';
import IControllers from './interface';
import { applyMiddlewares } from './middleware';
import { applyRoutes } from './router';

export function createServer({ port, controllers, config }: {
  port: number,
  controllers: IControllers,
  config: Config
}): express.Express {
  const app = express();

  applyRoutes(app, controllers);
  applyMiddlewares(app, config);

  app.listen(port, () => console.log(`Listening on port ${port}...`));

  return app;
}