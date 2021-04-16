import axios from 'axios';
import { Config } from '../utils/config';
import Auth from '../utils/auth';

export interface UserResponse {
  id:	number
  kod: string
  email: string
  prijmeni:	string
  jmeno: string
  role: string
}

export default class UsersApi {

  private config: Config;
  private auth: Auth;

  constructor(options: {
    config: Config,
    auth: Auth,
  }) {
    Object.assign(this, options);
  }

  async list(): Promise<UserResponse[]> {
    const req = await axios.get(`${this.config.flexibee.companyUrl}/uzivatel.json?limit=0&detail=custom:id,kod,email,prijmeni,jmeno,role`, {
      headers: this.auth.getBasicAuthHeader()
    });

    const users = req.data.winstrom.uzivatel;
    return users as UserResponse[];
  }

}