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

export interface CheckResponse {
  authSessionId: string
  refreshToken: string
  csrfToken: string
  success: boolean
}

export interface MeResponse {
  id: number
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

  async check(): Promise<CheckResponse> {
    const req = await axios.get(`${this.config.flexibee.companyUrl}/login-logout/check`, {
      headers: Object.assign({
        'Accept': 'application/json'
      }, this.auth.getBasicAuthHeader())
    });

    return req.data as CheckResponse;
  }

  async myId(token: string): Promise<number> {
    const req = await axios.get(`${this.config.flexibee.companyUrl}/uzivatel/(id=me())`, {
      headers: {
        'Accept': 'application/json',
        'Cookie': 'authSessionId=' + token,
      }
    });

    return req.data.winstrom.uzivatel[0].id;
  }

}