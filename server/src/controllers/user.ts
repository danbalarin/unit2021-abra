import { Response, Request, NextFunction } from 'express';
import UsersBusiness from '../business/Users';

export default class UsersController {
  
  private bc: UsersBusiness;

  constructor(options: {
    bc: UsersBusiness
  }) {
    Object.assign(this, options);
  }

  async validate(req: Request, res: Response, next: NextFunction ) {
    if (typeof req.headers.authTokenId !== "string") {
      return res.status(400).json({
        'error': `Header 'authTokenId' is not string.`,
      });
    }

    const token = req.headers.authTokenId as string;
    const user = await this.bc.getUserByAuthToken(token);

    if (user) {
      return next();
    } else {
      return res.status(401).json({
        'error': `Your auth token is invalid. Please login again.`,
      });
    }
  }
}