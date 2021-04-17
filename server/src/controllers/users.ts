import { Response, Request, NextFunction } from 'express';
import UsersBusinessInterface from '../business/usersInterface';

export default class UsersController {
  
  private bc: UsersBusinessInterface;

  constructor(options: {
    bc: UsersBusinessInterface
  }) {
    Object.assign(this, options);
  }

  async list(req: Request, res: Response) {
    try {
      const users = await this.bc.list();
      const data = users.map(reservation => reservation.toJSON());

      return res.json({
        success: true,
        data: data,
      });
    } catch (e) {
      console.error(e);
      return res.status(401).json({
        'error': `Your auth token is not valid. Please login again.`,
      });
    }
  }

  async validate(req: Request, res: Response, next: NextFunction) {
    if (typeof req.headers['x-authsessionid'] !== "string") {
      return res.status(400).json({
        'error': `Header 'X-authSessionId' is not string.`,
      });
    }

    const token = req.headers['x-authsessionid'] as string;
    
    try {
      const user = await this.bc.getUserByAuthToken(token);
      res.locals.user = user;
      return next();
    } catch (e) {
      console.log(e?.isAxiosError ? e.response.statusText : e);
      return res.status(401).json({
        'error': `Your auth token is not valid. Please login again.`,
      });
    }
  }
}